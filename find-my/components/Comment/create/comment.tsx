import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import useUser from '@libs/front/hooks/useUser';
import useMutation from '@libs/front/hooks/useMutation';
import MessageInput from '@components/MessageInput';

import { LostDetailResponse } from '../../../typeDefs/lost';

interface CommentForm {
  comment: string;
}
function CreateComment() {
  const router = useRouter();
  const [create, { loading, data: createResult }] = useMutation(`/api/losts/${router.query.id}/comments`, 'POST');
  const { user } = useUser();
  const { data, mutate } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentForm>();
  const onValid = useCallback(
    (comment: CommentForm) => {
      if (loading) return;
      create(comment);
    },
    [loading],
  );

  useEffect(() => {
    if (createResult && createResult.ok) {
      reset();
      if (!data || !user) return;
      //댓글 추가 mutate (optimistic ui 구현)
      mutate(
        {
          ...data,
          lost: {
            ...data.lost,
            _count: {
              ...data.lost._count,
              comments: data.lost._count.comments + 1,
            },
            //임시적으로 로그인된 user의 name과 avatar url ,id을 넣어줌
            comments: [
              ...data.lost.comments,
              {
                ...createResult.comment,
                reComment: [],
                user: { avatar: user?.avatar, id: user?.id, name: user?.name },
              },
            ],
          },
        },
        false,
      );
    }
  }, [createResult]);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <MessageInput register={register('comment', { required: true })} placeholder="댓글을 입력해 주세요." />
    </form>
  );
}

export default React.memo(CreateComment);

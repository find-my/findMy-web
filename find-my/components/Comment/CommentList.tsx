//댓글 추가
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import useUser from '@libs/front/hooks/useUser';
import useMutation from '@libs/front/hooks/useMutation';
import MessageInput from '@components/MessageInput';
import CommentItem from './CommentItem';
import { LostDetailResponse } from '../../typeDefs/lost';

interface CommentForm {
  comment: string;
}

function CommentList() {
  const router = useRouter();
  const { data } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  return (
    <div>
      <div>
        {data?.lost?.comments?.map((comment) => (
          <div key={comment.id} className="border-b p-2">
            <CommentItem commentId={comment.id} lostUserId={data?.lost?.userId} />
          </div>
        ))}
      </div>
      <CreateComment />
    </div>
  );
}

export default React.memo(CommentList);

function CreateComment() {
  const router = useRouter();
  const [createComment, { loading, data: createCommentResult }] = useMutation(
    `/api/losts/${router.query.id}/comments`,
    'POST',
  );
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
      createComment(comment);
    },
    [loading],
  );

  useEffect(() => {
    if (createCommentResult && createCommentResult.ok) {
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
                ...createCommentResult.comment,
                reComment: [],
                user: { avatar: user?.avatar, id: user?.id, name: user?.name },
              },
            ],
          },
        },
        false,
      );
    }
  }, [createCommentResult]);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <MessageInput register={register('comment', { required: true })} placeholder="댓글을 입력해 주세요." />
    </form>
  );
}

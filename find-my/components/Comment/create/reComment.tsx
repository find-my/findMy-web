import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import SquareMessageInput from '@components/SquareMessageInput';
import { CommentDetailResponse, LostDetailResponse } from '../../../typeDefs/lost';
import useMutation from '@libs/front/hooks/useMutation';
import useSWR from 'swr';
import useUser from '@libs/front/hooks/useUser';
interface ReCommentForm {
  reComment: string;
}

interface Props {
  commentId: number;
  ModeOff: () => void;
}

function CreateRecomment({ commentId, ModeOff }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const [create, { data: createResult, loading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments`,
    'POST',
  );
  const { register, handleSubmit, reset } = useForm<ReCommentForm>();
  const onValid = useCallback(
    (reComment: ReCommentForm) => {
      if (loading) return;
      create(reComment);
    },
    [loading],
  );
  useEffect(() => {
    if (createResult && createResult.ok) {
      console.log(createResult.reComment);
      if (!data) return;
      mutate(
        //대댓글 mutate
        {
          ...data,
          comment: {
            ...data.comment,
            reComments: [
              ...data.comment.reComments,
              {
                ...createResult?.reComment,
                user: {
                  id: user?.id,
                  name: user?.name,
                  avatar: user?.avatar,
                },
              },
            ],
          },
        },
        false,
      );
      reset();
      ModeOff();
    }
  }, [createResult]);
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <SquareMessageInput register={register('reComment', { required: true })} placeholder="대댓글을 입력해 주세요." />
    </form>
  );
}

export default React.memo(CreateRecomment);

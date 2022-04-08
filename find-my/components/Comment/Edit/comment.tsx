import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { CommentDetailResponse, LostDetailResponse } from '../../../typeDefs/lost';
import useMutation from '@libs/front/hooks/useMutation';
import useSWR from 'swr';

interface TempProps {
  commentId: number;
  ModeOff: () => void;
}
interface CommentForm {
  comment: string;
}

function EditComment({ commentId, ModeOff }: TempProps) {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<CommentForm>();

  const [update, { data: updateResult, loading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}`,
    'PUT',
  );
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );

  const onValid = useCallback(
    (comment: CommentForm) => {
      if (loading) return;
      update(comment);
    },
    [loading],
  );
  useEffect(() => {
    if (updateResult && updateResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          comment: {
            ...data.comment,
            content: updateResult.comment,
          },
        },
        false,
      );
      reset();
      ModeOff();
    }
  }, [updateResult]);
  return (
    <form onSubmit={handleSubmit(onValid)} className="flex items-end">
      <TextareaAutosize
        {...register('comment', { required: true })}
        placeholder="댓글 입력"
        className="rounded  w-3/4 mx-4 "
      />
      <label>
        <input type="submit" className="hidden" />

        <svg
          className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer rotate-90"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
        </svg>
      </label>
    </form>
  );
}

export default React.memo(EditComment);

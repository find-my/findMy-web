import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/front/hooks/useMutation';
import React, { useEffect, useCallback, useRef } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { CommentDetailResponse } from '../../../typeDefs/post';

interface Props {
  commentId: string;
  reCommentId: number;
  ModeOff: () => void;
}
interface ReCommentForm {
  reComment: string;
}
function useOutsideClick(ref: any, ModeOff: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      console.log(ref);
      if (ref.current && !ref.current.contains(event.target)) {
        ModeOff();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
function EditRecomment({ commentId, reCommentId, ModeOff }: Props) {
  const router = useRouter();
  const outsideRef = useRef(null);
  useOutsideClick(outsideRef, ModeOff);
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const [update, { data: updateResult, loading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments/${reCommentId}`,
    'PUT',
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReCommentForm>();
  const onValid = (reComment: ReCommentForm) => {
    console.log(123);
    if (loading) return;
    update(reComment);
  };
  useEffect(() => {
    if (updateResult && updateResult.ok) {
      console.log(456);
      if (!data) return;
      mutate(
        {
          ...data,
          comment: {
            ...data.comment,
            reComments: data.comment.reComments.map((rc) => {
              if (rc.id !== reCommentId) return rc;
              else {
                return { ...rc, content: updateResult.reComment };
              }
            }),
          },
        },
        false,
      );
      ModeOff();
      reset();
    }
  }, [updateResult]);
  return (
    <form onSubmit={handleSubmit(onValid)} ref={outsideRef} className="flex items-end">
      <TextareaAutosize
        {...register('reComment', { required: true })}
        placeholder="대댓글 수정"
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

export default React.memo(EditRecomment);

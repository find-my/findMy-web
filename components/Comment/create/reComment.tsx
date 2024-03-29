import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import SquareMessageInput from '@components/SquareMessageInput';
import { CommentDetailResponse, PostDetailResponse } from '../../../typeDefs/post';
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
function CreateRecomment({ commentId, ModeOff }: Props) {
  const { user } = useUser();
  const router = useRouter();
  const outsideRef = useRef(null);
  useOutsideClick(outsideRef, ModeOff);
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/posts/${router.query.id}/comments/${commentId}` : null,
  );
  const [create, { data: createResult, loading }] = useMutation(
    `/api/posts/${router.query.id}/comments/${commentId}/recomments`,
    'POST',
  );
  const { data: postData, mutate: postMutate } = useSWR<PostDetailResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null,
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
      if (!data || !postData) return;
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
      ); //댓글 수 임의 조작
      postMutate({
        ...postData,
        post: { ...postData.post, _count: { ...postData.post._count, comments: postData.post._count.comments + 1 } },
      });
      reset();
      ModeOff();
    }
  }, [createResult]);
  return (
    <form onSubmit={handleSubmit(onValid)} ref={outsideRef}>
      <SquareMessageInput register={register('reComment', { required: true })} placeholder="대댓글을 입력해 주세요." />
    </form>
  );
}

export default React.memo(CreateRecomment);

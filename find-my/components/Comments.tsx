import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import { Lost, User, Comment, ReComment } from '@prisma/client';
import { useForm } from 'react-hook-form';
import useUser from '@libs/front/hooks/useUser';
import useMutation from '@libs/front/hooks/useMutation';
import MessageInput from '@components/MessageInput';
import CommentItem from './Comment/CommentItem';
import { LostDetailResponse, CommentDetailResponse, CommentsResponse } from '../typeDefs/lost';

interface CommentForm {
  comment: string;
}

function Comments() {
  const router = useRouter();
  const [createComment, { loading, data: createCommentResult }] = useMutation(
    `/api/losts/${router.query.id}/comments`,
    'POST',
  );
  const { user, isLoading: userLoading } = useUser();
  const { data, mutate, error } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CommentForm>();
  const onValid = (comment: CommentForm) => {
    if (loading) return;
    reset();
    createComment(comment);
  };

  useEffect(() => {
    if (createCommentResult && createCommentResult.ok) {
      if (!data) return;
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
                user: { avatar: user.avatar, id: user.id, name: user.name },
              },
            ],
          },
        },
        false,
      );
    }
  }, [createCommentResult]);
  return (
    <div>
      <div>
        {data?.lost?.comments?.map((comment: any, i: number) => (
          <div key={comment.id} className="border-b p-2">
            <CommentItem commentId={comment.id} lostUserId={data?.lost?.userId} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onValid)}>
        <MessageInput register={register('comment', { required: true })} placeholder="댓글을 입력해 주세요." />
      </form>
    </div>
  );
}

export default React.memo(Comments);

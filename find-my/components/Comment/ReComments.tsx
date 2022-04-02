import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import SquareMessageInput from '@components/SquareMessageInput';
import useMutation from '@libs/front/hooks/useMutation';
import React, { useEffect, useCallback, useState } from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import useUser from '@libs/front/hooks/useUser';
import { useRouter } from 'next/router';
import {
  ExtendedReComment,
  ExtendedComment,
  ExtendedLost,
  LostDetailResponse,
  CommentDetailResponse,
} from '../../typeDefs/lost';

interface ReCommentForm {
  reComment: string;
}
interface Props {
  lostId: string;
  commentId: string;
  state: 'display' | 'create' | 'update' | 'delete';
  reComment: ExtendedReComment;
  lostUserId: number;
}
function ReComments({ lostId, commentId, state, lostUserId, reComment }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ReCommentForm>();
  console.log(reComment);
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [addReCommentMode, setAddReCommentMode] = useState<boolean>(false);
  const [remove, { data: removeResult, loading: removeLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments/${reComment.id}`,
    'DELETE',
  );
  const [update, { data: updateResult, loading: updateLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments/${reComment.id}`,
    'PUT',
  );
  const onReCommentClick = useCallback(() => {
    setAddReCommentMode(true);
  }, []);
  const onDelete = () => {
    if (removeLoading) return;
    if (+reComment?.user?.id === +user?.id) {
      remove({});
    }
  };
  const onUpdate = () => {
    setEditMode(true);
  };
  const onValid = (reComment: ReCommentForm) => {
    if (updateLoading) return;
    update(reComment);
  };
  useEffect(() => {
    if (updateResult && updateResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          comment: {
            ...data.comment,
            reComments: data.comment.reComments.map((rc) => {
              if (rc.id !== reComment.id) return rc;
              else {
                return { ...rc, content: updateResult.reComment };
              }
            }),
          },
        },
        false,
      );
    }
    setEditMode(false);
    reset();
  }, [updateResult]);

  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          comment: {
            ...data.comment,
            reComments: data.comment.reComments.filter((rc) => rc.id !== reComment.id),
          },
        },
        false,
      );
    }
  }, [removeResult]);

  return (
    <div>
      <div className="flex w-full justify-between space-x-2 items-start">
        <div className="w-5 h-5 bg-purple-500 rounded-full" />
        <div className="w-full ">
          <div className="text-sm flex items-start justify-between">
            <div className="cursor-pointer flex items-center space-x-1">
              <span>{reComment?.user?.name || null}</span>
              <span>{+reComment?.user?.id === lostUserId ? <>(글쓴이)</> : null}</span>
            </div>
            <div className="relative">
              <button>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  ></path>
                </svg>
              </button>

              <div className="absolute right-0 top-0 shadow-md bg-white p-2 flex flex-col items-start whitespace-nowrap opacity-0 hover:opacity-100">
                {+reComment?.user?.id === +user?.id ? (
                  <>
                    <button onClick={onUpdate} className="p-1">
                      수정
                    </button>
                    <button onClick={onDelete} className="p-1">
                      삭제
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-1">
            {editMode ? (
              <form onSubmit={handleSubmit(onValid)} className="flex items-end">
                <TextareaAutosize
                  {...register('reComment', { required: true })}
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
            ) : (
              reComment.content
            )}
          </p>
          <div className="flex space-x-1 text-xs text-slate-500">
            <span>3/15</span>
            <span>20:54</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReComments;
/*
 <form onSubmit={handleSubmit(onValid)}>
      <SquareMessageInput register={register('reComment', { required: true })} placeholder="대댓글을 입력해 주세요." />
    </form>

*/

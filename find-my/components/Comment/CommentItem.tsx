import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Lost, User, Comment, ReComment } from '@prisma/client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import useMutation from '@libs/front/hooks/useMutation';
import useUser from '@libs/front/hooks/useUser';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import ReComments from '@components/Comment/ReComments';
import SquareMessageInput from '@components/SquareMessageInput';
import { CommentsResponse, CommentDetailResponse, LostDetailResponse } from '../../typeDefs/lost';

interface Props {
  commentId: number;
  lostUserId: number;
}
interface CommentForm {
  comment: string;
}
interface ReCommentForm {
  reComment: string;
}

function CommentItem({ commentId, lostUserId }: Props) {
  const { user, isLoading: userLoading } = useUser();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [addReCommentMode, setAddReCommentMode] = useState<boolean>(false);
  const router = useRouter();
  const { register: CommentRegister, handleSubmit: CommentHandleSubmit, reset: CommentReset } = useForm<CommentForm>();
  const {
    register: ReCommentRegister,
    handleSubmit: ReCommentHandleSubmit,
    reset: ReCommentReset,
  } = useForm<ReCommentForm>();
  const [createdReComment, { data: createdReCommentResult, loading: createdReCommentLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments`,
    'POST',
  );
  const [remove, { data: removeResult, loading: removeLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}`,
    'DELETE',
  );
  const [update, { data: updateResult, loading: updateLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}`,
    'PUT',
  );
  const { data: lostData, mutate: lostMutate } = useSWR<LostDetailResponse>(
    router.query.id ? `/api/losts/${router.query.id}` : null,
  );
  const { data: commentData, mutate: commentMutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const onReCommentClick = useCallback(() => {
    setAddReCommentMode(true);
  }, []);
  const onDelete = () => {
    if (removeLoading) return;
    if (!commentData) return;
    if (+commentData.comment.userId === +(user?.id || -1)) {
      remove({});
    }
  };
  const onUpdate = () => {
    setEditMode(true);
  };
  const onCommentValid = (comment: CommentForm) => {
    if (updateLoading) return;
    update(comment);
  };
  const onReCommentValid = (reComment: ReCommentForm) => {
    if (createdReCommentLoading) return;
    createdReComment(reComment);
  };
  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!lostData) return;
      lostMutate(
        { ...lostData, lost: { ...lostData.lost, comments: lostData.lost.comments.filter((c) => c.id !== commentId) } },
        false,
      );
    }
  }, [removeResult]);
  useEffect(() => {
    if (createdReCommentResult && createdReCommentResult.ok) {
      console.log(createdReCommentResult.reComment);
      if (!commentData) return;
      commentMutate(
        {
          ...commentData,
          comment: {
            ...commentData.comment,
            reComments: [
              ...commentData.comment.reComments,
              {
                ...createdReCommentResult?.reComment,
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
    }
    ReCommentReset();
    setAddReCommentMode(false);
  }, [createdReCommentResult]);
  useEffect(() => {
    console.log(updateResult && updateResult.ok);
    if (updateResult && updateResult.ok) {
      if (!commentData) return;
      commentMutate(
        {
          ...commentData,
          comment: {
            ...commentData.comment,
            content: updateResult.comment,
          },
        },
        false,
      );
      CommentReset();
      setEditMode(false);
    }
  }, [updateResult]);
  return (
    <div className="flex w-full justify-between space-x-2 items-start">
      {commentData?.comment?.user?.avatar ? (
        <img
          src={`https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${commentData?.comment?.user?.avatar}/public`}
          className="w-5 h-5 bg-purple-500 rounded-full"
        />
      ) : (
        <div className="w-5 h-5 bg-purple-500 rounded-full" />
      )}
      <div className="w-full ">
        <div className="text-sm flex items-start justify-between">
          <div className="cursor-pointer flex items-center space-x-1">
            <span>{commentData?.comment?.user?.name || null}</span>
            <span>{commentData?.comment?.user?.id === lostUserId ? <>(글쓴이)</> : null}</span>
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
              <button onClick={onReCommentClick} className="p-1">
                대댓글 달기
              </button>
              {commentData?.comment?.user?.id === user?.id ? (
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
            <form onSubmit={CommentHandleSubmit(onCommentValid)} className="flex items-end">
              <TextareaAutosize
                {...CommentRegister('comment', { required: true })}
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
            commentData?.comment?.content
          )}
        </p>
        <div className="flex space-x-1 text-xs text-slate-500">
          <span>3/15</span>
          <span>20:54</span>
        </div>
        {addReCommentMode ? (
          <form onSubmit={ReCommentHandleSubmit(onReCommentValid)}>
            <SquareMessageInput
              register={ReCommentRegister('reComment', { required: true })}
              placeholder="대댓글을 입력해 주세요."
            />
          </form>
        ) : null}
        {commentData?.comment?.reComments?.map((reCo) => (
          <ReComments
            key={reCo.id}
            lostId={router.query.id + ''}
            commentId={commentData.comment.id + ''}
            state={'create'}
            reComment={reCo}
            lostUserId={lostUserId}
          />
        ))}
      </div>
    </div>
  );
}
export default CommentItem;

/*  
  <div className="border divide-y">
          {comment?.reComment?.map((reCo) => (
            <div key={reCo.id} className="">
              {reCo.content} {reCo.user?.name} {reCo.user?.avatar}
            </div>
          ))}
        </div>

*/

//댓글 대댓글 추가 삭제시 count mutate 적용되게 수정해야함
//댓글 업데이트,삭제,대댓글 작성
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '@libs/front/hooks/useMutation';
import useUser from '@libs/front/hooks/useUser';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import ReComments from '@components/Comment/ReCommentList';
import SquareMessageInput from '@components/SquareMessageInput';
import { CommentDetailResponse, LostDetailResponse } from '../../typeDefs/lost';

interface Props {
  commentId: number;
  lostUserId: number;
}
interface CommentForm {
  comment: string;
}

function CommentItem({ commentId, lostUserId }: Props) {
  const { user } = useUser();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [addReCommentMode, setAddReCommentMode] = useState<boolean>(false);
  const router = useRouter();
  const [remove, { data: removeResult, loading: removeLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}`,
    'DELETE',
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

  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!lostData || !user) return;
      lostMutate(
        { ...lostData, lost: { ...lostData.lost, comments: lostData.lost.comments.filter((c) => c.id !== commentId) } },
        false,
      );
    }
  }, [removeResult]);

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
            <EditComment commentId={commentId} ModeOff={() => setEditMode(false)} />
          ) : (
            commentData?.comment?.content
          )}
        </p>
        <div className="flex space-x-1 text-xs text-slate-500">
          <span>3/15</span>
          <span>20:54</span>
        </div>
        {addReCommentMode ? <CreateRecomment commentId={commentId} ModeOff={() => setAddReCommentMode(false)} /> : null}
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
export default React.memo(CommentItem);

interface ReCommentForm {
  reComment: string;
}

interface TempProps {
  commentId: number;
  ModeOff: () => void;
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

function CreateRecomment({ commentId, ModeOff }: TempProps) {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const [createdReComment, { data: createdReCommentResult, loading: createdReCommentLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments`,
    'POST',
  );
  const { register, handleSubmit, reset } = useForm<ReCommentForm>();
  const onValid = useCallback(
    (reComment: ReCommentForm) => {
      if (createdReCommentLoading) return;
      createdReComment(reComment);
    },
    [createdReCommentLoading],
  );
  useEffect(() => {
    if (createdReCommentResult && createdReCommentResult.ok) {
      console.log(createdReCommentResult.reComment);
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
      reset();
      ModeOff();
    }
  }, [createdReCommentResult]);
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <SquareMessageInput register={register('reComment', { required: true })} placeholder="대댓글을 입력해 주세요." />
    </form>
  );
}

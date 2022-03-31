import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Lost, User, Comment } from '@prisma/client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import usePost from '@libs/front/hooks/usePost';
import useUser from '@libs/front/hooks/useUser';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
interface ExtendedComment extends Comment {
  user: User;
}
interface ExtendedLost extends Lost {
  user: User;
  _count: {
    scraps: number;
    comments: number;
  };
  comments: ExtendedComment[];
}
interface LostDetailResponse {
  ok: boolean;
  lost: ExtendedLost;
  isScraped: boolean;
}
interface Props {
  comment: ExtendedComment;
}
interface CommentForm {
  comment: string;
}
function CommentItem({ comment }: Props) {
  const { user, isLoading: userLoading } = useUser();
  const [editMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CommentForm>();
  const [remove, { data: removeResult, loading: removeLoading }] = usePost(
    `/api/losts/${router.query.id}/comments/delete/${comment.id}`,
  );
  const [update, { data: updateResult, loading: updateLoading }] = usePost(
    `/api/losts/${router.query.id}/comments/update/${comment.id}`,
  );
  console.log(comment?.user.id, +user?.id);
  const { data, mutate, error } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const onDelete = () => {
    if (removeLoading) return;
    if (+comment?.user?.id === +user?.id) {
      remove({});
    }
  };
  const onUpdate = () => {
    setEditMode(true);
  };
  const onValid = (comment: CommentForm) => {
    if (updateLoading) return;
    update(comment);
  };
  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          lost: {
            ...data.lost,
            _count: {
              ...data.lost._count,
              comments: data.lost._count.comments - 1,
            },
            //임시적으로 로그인된 user의 name과 avatar url ,id을 넣어줌
            comments: data.lost.comments.filter((c) => c.id !== comment.id),
          },
        },
        false,
      );
    }
  }, [removeResult]);
  useEffect(() => {
    console.log(updateResult && updateResult.ok);
    if (updateResult && updateResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          lost: {
            ...data.lost,
            comments: data.lost.comments.map((c) => {
              if (c.id !== comment.id) return { ...c };
              else {
                return { ...c, content: updateResult.comment };
              }
            }),
          },
        },
        false,
      );
      reset();
      setEditMode(false);
    }
  }, [updateResult]);
  return (
    <>
      <div className="text-sm flex justify-between">
        <div className="cursor-pointer flex items-center space-x-1">
          <div className="w-5 h-5 bg-purple-500 rounded-full" />
          <span>{comment?.user?.name || null}</span>
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
            <button className="p-1">대댓글 달기</button>
            {+comment?.user?.id === +user?.id ? (
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
        ) : (
          comment.content
        )}
      </p>
      <div className="flex space-x-1 text-xs text-slate-500">
        <span>3/15</span>
        <span>20:54</span>
      </div>
    </>
  );
}
export default CommentItem;

import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Lost, User, Comment } from '@prisma/client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from './Modal';

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
function CommentItem({ comment }: Props) {
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
            <button className="p-1">수정</button>
            <button className="p-1">삭제</button>
          </div>
        </div>
      </div>
      <p className="mt-1">{comment.content}</p>
      <div className="flex space-x-1 text-xs text-slate-500">
        <span>3/15</span>
        <span>20:54</span>
      </div>
    </>
  );
}
export default CommentItem;

import React from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import { Lost, User, Comment } from '@prisma/client';
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
  comments: any;
}
function Comments({ comments }: Props) {
  return (
    <div>
      <div>
        {comments?.map((comment: any, i: number) => (
          <div key={comment.id} className="border-b p-2">
            <div className="text-sm flex justify-between">
              <div className="cursor-pointer flex items-center space-x-1">
                <div className="w-5 h-5 bg-purple-500 rounded-full" />
                <span>{comment?.user?.name || null}</span>
              </div>
              <div>
                <button className="flex items-center space-x-1 text-slate-500 text-xs">
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
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    ></path>
                  </svg>
                  <span>대댓글 달기</span>
                </button>
              </div>
            </div>
            <p className="mt-1">{comment.content}</p>
            <div className="flex space-x-1 text-xs text-slate-500">
              <span>3/15</span>
              <span>20:54</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Comments);

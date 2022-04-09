import { ExtendedLost, ExtendedComment } from '../../typeDefs/lost';
import { displayTimeForList } from '@libs/front/displayTime';
import React from 'react';
import { CFImageUrl } from '@libs/front/cfImage';
interface Props {
  lost: ExtendedLost;
}
function countRecomments(comments: ExtendedComment[]): number {
  let recommentCount = 0;
  comments?.forEach((comment) => (recommentCount += comment._count.reComments));
  return recommentCount;
}
function LostItem({ lost }: Props) {
  const {
    photos,
    title,
    lostPlace,
    createdAt,
    user: { name },
    _count: { scraps: scrapCount, comments: commentCount },
  } = lost;
  //대댓글 수를 세는 함수 따로 분리하기

  const recommentCount = countRecomments(lost?.comments);
  const ago = displayTimeForList(createdAt.toString());
  return (
    <div className="flex border-b pb-4 cursor-pointer justify-between items-end px-4">
      <div className="flex space-x-4 w-2/3">
        <>
          {photos && photos[0]?.file ? (
            <img src={CFImageUrl(photos[0]?.file)} className="w-20 h-20 min-w-fit rounded bg-slate-500" />
          ) : (
            <div className="w-20 h-20 min-w-fit rounded bg-slate-500" />
          )}
        </>
        <div className="flex flex-col  w-2/3 overflow-x-hidden">
          <div>
            <h3 className="text-base font-semibold">{title}</h3>

            <span className="block text-sm font-medium">{lostPlace}</span>
          </div>
          <div className="flex items-end text-xs font-medium text-slate-500">
            <span className="text-xs font-medium">{ago}</span> <span> ㅣ </span>{' '}
            <span className="text-xs font-medium">{name}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 text-slate-500 ">
        <div className="flex items-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <span>{photos.length}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          <span>{commentCount + recommentCount}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
          </svg>
          <span>{scrapCount}</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(LostItem);

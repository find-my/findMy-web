import React, { useEffect, useRef } from 'react';
import { ExtendedPost } from '../../typeDefs/post';
import PostItem from '@components/Post/PostItem';

interface Props {
  postList: ExtendedPost[];
  inViewRef: (node?: Element | null | undefined) => void;
}

function PostList({ postList, inViewRef }: Props) {
  return (
    <div className="flex flex-col space-y-5  py-10">
      {postList?.map((post, i) => (
        <React.Fragment key={post.id}>
          {i === postList.length - 1 ? (
            <div ref={inViewRef}>
              <PostItem key={post.id} post={post} />
            </div>
          ) : (
            <PostItem key={post.id} post={post} />
          )}
        </React.Fragment>
      ))}
      <button className="fixed bottom-16 right-2 hover:bg-blue-500 transition-colors p-2 text-white bg-blue-400 rounded-full">
        <svg
          className="h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

export default React.memo(PostList);

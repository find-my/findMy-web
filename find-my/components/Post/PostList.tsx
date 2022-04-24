import React, { useEffect, useRef } from 'react';
import { ExtendedPost } from '../../typeDefs/post';
import PostItem from '@components/Post/PostItem';
import PostUploadButton from '@components/Post/PostUploadButton';

interface Props {
  postList: ExtendedPost[];
  inViewRef: (node?: Element | null | undefined) => void;
}

function PostList({ postList, inViewRef }: Props) {
  return (
    <div className="flex flex-col space-y-5  py-11 ">
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

      <PostUploadButton />
    </div>
  );
}

export default React.memo(PostList);

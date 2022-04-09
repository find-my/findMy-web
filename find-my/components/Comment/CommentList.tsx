//댓글 추가
import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import CommentItem from './CommentItem';
import { PostDetailResponse } from '../../typeDefs/post';
import CreateComment from '@components/Comment/create/comment';

function CommentList() {
  const router = useRouter();
  const { data } = useSWR<PostDetailResponse>(router.query.id ? `/api/posts/${router.query.id}` : null);
  return (
    <div>
      <div>
        {data?.post?.comments?.map((comment) => (
          <div key={comment.id} className="border-b p-2">
            <CommentItem commentId={comment.id} postUserId={data?.post?.userId} />
          </div>
        ))}
      </div>
      <CreateComment />
    </div>
  );
}

export default React.memo(CommentList);

//댓글 추가
import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import CommentItem from './CommentItem';
import { LostDetailResponse } from '../../typeDefs/lost';
import CreateComment from '@components/Comment/create/comment';

function CommentList() {
  const router = useRouter();
  const { data } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  return (
    <div>
      <div>
        {data?.lost?.comments?.map((comment) => (
          <div key={comment.id} className="border-b p-2">
            <CommentItem commentId={comment.id} lostUserId={data?.lost?.userId} />
          </div>
        ))}
      </div>
      <CreateComment />
    </div>
  );
}

export default React.memo(CommentList);

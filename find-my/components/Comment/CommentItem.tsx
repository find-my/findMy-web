//댓글 대댓글 추가 삭제시 count mutate 적용되게 수정해야함
//댓글 업데이트,삭제,대댓글 작성
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '@libs/front/hooks/useMutation';
import useUser from '@libs/front/hooks/useUser';
import ReCommentItem from '@components/Comment/ReCommentItem';
import { CommentDetailResponse, LostDetailResponse } from '../../typeDefs/lost';
import CreateRecomment from '@components/Comment/create/reComment';
import EditComment from '@components/Comment/Edit/comment';
import { CFImageUrl } from '@libs/front/cfImage';
interface Props {
  commentId: number;
  lostUserId: number;
}
function useOutsideClick(ref: any, ModeOff: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      console.log(ref);
      if (ref.current && !ref.current.contains(event.target)) {
        ModeOff();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
function CommentItem({ commentId, lostUserId }: Props) {
  const { user } = useUser();
  const outsideRef = useRef(null);

  const [showMene, setShowMenu] = useState<boolean>(false);
  useOutsideClick(outsideRef, () => setShowMenu(false));
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
  const { data: commentData } = useSWR<CommentDetailResponse>(
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
        <img src={CFImageUrl(commentData?.comment?.user?.avatar)} className="w-5 h-5 bg-purple-500 rounded-full" />
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
            <button onClick={() => setShowMenu(true)}>
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
            {showMene ? (
              <div
                ref={outsideRef}
                className="absolute right-0 top-0 shadow-md bg-white p-2 flex flex-col items-start whitespace-nowrap z-10"
              >
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
            ) : null}
          </div>
        </div>
        <div className="mt-1">
          {editMode ? (
            <EditComment commentId={commentId} ModeOff={() => setEditMode(false)} />
          ) : (
            commentData?.comment?.content
          )}
        </div>
        <div className="flex space-x-1 text-xs text-slate-500">
          <span>3/15</span>
          <span>20:54</span>
        </div>
        {addReCommentMode ? <CreateRecomment commentId={commentId} ModeOff={() => setAddReCommentMode(false)} /> : null}
        {commentData?.comment?.reComments?.map((reCo) => (
          <ReCommentItem
            key={reCo.id}
            commentId={commentData.comment.id + ''}
            reComment={reCo}
            lostUserId={lostUserId}
          />
        ))}
      </div>
    </div>
  );
}
export default React.memo(CommentItem);

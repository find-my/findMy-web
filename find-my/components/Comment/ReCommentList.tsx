import useMutation from '@libs/front/hooks/useMutation';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import useUser from '@libs/front/hooks/useUser';
import { useRouter } from 'next/router';
import { ExtendedReComment, CommentDetailResponse } from '../../typeDefs/lost';
import EditRecomment from '@components/Comment/Edit/reComment';

interface Props {
  commentId: string;
  reComment: ExtendedReComment;
  lostUserId: number;
}
function ReComments({ commentId, lostUserId, reComment }: Props) {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate } = useSWR<CommentDetailResponse>(
    commentId ? `/api/losts/${router.query.id}/comments/${commentId}` : null,
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [remove, { data: removeResult, loading: removeLoading }] = useMutation(
    `/api/losts/${router.query.id}/comments/${commentId}/recomments/${reComment.id}`,
    'DELETE',
  );
  const onDelete = () => {
    if (removeLoading) return;
    if (+reComment?.user?.id === +(user?.id || -1)) {
      remove({});
    }
  };
  const onUpdate = () => {
    setEditMode(true);
  };

  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          comment: {
            ...data.comment,
            reComments: data.comment.reComments.filter((rc) => rc.id !== reComment.id),
          },
        },
        false,
      );
    }
  }, [removeResult]);

  return (
    <div>
      <div className="flex w-full justify-between space-x-2 items-start">
        {reComment?.user?.avatar ? (
          <img
            src={`https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${reComment?.user?.avatar}/public`}
            className="w-5 h-5 bg-purple-500 rounded-full"
          />
        ) : (
          <div className="w-5 h-5 bg-purple-500 rounded-full" />
        )}
        <div className="w-full ">
          <div className="text-sm flex items-start justify-between">
            <div className="cursor-pointer flex items-center space-x-1">
              <span>{reComment?.user?.name || null}</span>
              <span>{+reComment?.user?.id === lostUserId ? <>(글쓴이)</> : null}</span>
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
                {+reComment?.user?.id === +(user?.id || -1) ? (
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
          <div className="mt-1">
            {editMode ? (
              <EditRecomment commentId={commentId} reCommentId={reComment.id} ModeOff={() => setEditMode(false)} />
            ) : (
              reComment.content
            )}
          </div>
          <div className="flex space-x-1 text-xs text-slate-500">
            <span>3/15</span>
            <span>20:54</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReComments;
/*
 <form onSubmit={handleSubmit(onValid)}>
      <SquareMessageInput register={register('reComment', { required: true })} placeholder="대댓글을 입력해 주세요." />
    </form>

*/

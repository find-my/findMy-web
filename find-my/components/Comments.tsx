import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import { Lost, User, Comment } from '@prisma/client';
import { useForm } from 'react-hook-form';
import useUser from '@libs/front/hooks/useUser';
import usePost from '@libs/front/hooks/usePost';
import MessageInput from '@components/MessageInput';
import CommentItem from './CommentItem';
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
interface CommentForm {
  comment: string;
}
function displayedAt(createdAt: string) {
  if (!createdAt) return;
  const now = new Date();
  const year = now.getFullYear();

  const createdArr = createdAt.split('-');
  const createdY = createdArr[0];
  const createdM = createdArr[1];
  const createdD = createdArr[2].split('T')[0];
  const createdH = createdArr[2].split('T')[1].split(':')[0];
  const createdMin = createdArr[2].split('T')[1].split(':')[1];
  //createdAt.getTime();
  console.log(now, createdArr, createdY, createdM, createdD, createdH, createdMin);

  const Y_SAME = year === +createdY;

  if (Y_SAME) {
    return `${createdM}/${createdD} ${createdH}:${createdMin}`;
  }
  return `${createdY}/${createdM}/${createdD} ${createdH}:${createdMin}`;
}
function Comments() {
  const router = useRouter();
  const [isMenuClicked, setIsMenuClicked] = useState<boolean>(false);
  const [createComment, { loading, data: createCommentResult }] = usePost(`/api/losts/${router.query.id}/comments`);
  const { mutate: commentMutate } = useSWR(`/api/losts/${router.query.id}/comments`);
  const { user, isLoading: userLoading } = useUser();
  const { data, mutate, error } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CommentForm>();
  const onValid = (comment: CommentForm) => {
    if (loading) return;
    reset();
    createComment(comment);
  };

  useEffect(() => {
    if (createCommentResult && createCommentResult.ok) {
      if (!data) return;
      mutate(
        {
          ...data,
          lost: {
            ...data.lost,
            _count: {
              ...data.lost._count,
              comments: data.lost._count.comments + 1,
            },
            //임시적으로 로그인된 user의 name과 avatar url ,id을 넣어줌
            comments: [
              ...data.lost.comments,
              {
                ...createCommentResult.comment,
                reComment: [],
                user: { avatar: user.avatar, id: user.id, name: user.name },
              },
            ],
          },
        },
        false,
      );
      console.log(data.lost.comments);
    }
  }, [createCommentResult]);
  return (
    <div>
      <div>
        {data?.lost?.comments?.map((comment: any, i: number) => (
          <div key={comment.id} className="border-b p-2">
            <CommentItem comment={comment} />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onValid)}>
        <MessageInput register={register('comment', { required: true })} placeholder="댓글을 입력해 주세요." />
      </form>
    </div>
  );
}

export default React.memo(Comments);

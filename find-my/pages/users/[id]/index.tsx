import useUser from '@libs/front/hooks/useUser';
import type { NextPage } from 'next';
import useSWR from 'swr';
import { Review, User } from '@prisma/client';
import { classNames } from '@libs/front/utils';
import { useEffect, useState } from 'react';
import PostList from '@components/Post/PostList';
import { PostListResponse } from '../../../typeDefs/post';
import { useRouter } from 'next/router';
import useMutation from '@libs/front/hooks/useMutation';
interface ExtendedReview extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ExtendedReview[];
}
const Profile: NextPage = () => {
  const router = useRouter();
  console.log();
  const { user: userLoggedIn } = useUser();
  const { data: user } = useSWR(router.query.id ? `/api/users/${router.query.id}` : null);
  const { data: userPostsData, error } = useSWR<PostListResponse>(`/api/users/${router.query.id}/posts`);
  const { data: reviewsData } = useSWR<ReviewsResponse>(`/api/users/${router.query.id}/reviews`);
  const [viewFilter, setViewFilter] = useState<'Post' | 'Found' | 'UserReview'>('UserReview');
  console.log(user);
  return (
    <div className="py-10 px-4">
      <div className="flex space-x-4 items-center border-b border-slate-300 pb-4">
        {user?.userData?.avatar ? (
          <img
            src={`https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${user?.userData?.avatar}/public`}
            className="w-14 h-14 rounded-full bg-slate-500"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-500" />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{user?.userData?.name || null}</span>
          <button className="border border-slate-500 text-xs p-1 rounded">
            {userLoggedIn?.id === +(router.query.id || -1) ? <>프로필 수정</> : <>리뷰 작성</>}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2 border-b ">
        <button
          onClick={() => setViewFilter('Post')}
          className="text-center text-white bg-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:bg-blue-400"
        >
          <span>찾고 있는 물건</span>
        </button>
        <button
          onClick={() => setViewFilter('Found')}
          className="text-center text-white bg-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:bg-blue-400 "
        >
          <span>주인을 찾아요</span>
        </button>
        <button
          onClick={() => setViewFilter('UserReview')}
          className="text-center text-white bg-gray-400 p-2 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:bg-blue-400"
        >
          <span>사용자 리뷰</span>
        </button>
      </div>

      {viewFilter === 'Post' ? <Userposts userPostsData={userPostsData} /> : null}
      {viewFilter === 'UserReview' ? <UserReviews reviewsData={reviewsData} /> : null}
    </div>
  );
};
export default Profile;

interface UserPostsProps {
  userPostsData: PostListResponse | undefined;
}
function Userposts({ userPostsData }: UserPostsProps) {
  if (!userPostsData || !userPostsData.ok) return null;
  //GetpostResult 이 받는 interface를 userpostData.posts 만 받게 고치기
  return (
    <>
      <PostList postList={userPostsData.postList} />
    </>
  );
}

interface ReviewsProps {
  reviewsData: ReviewsResponse | undefined;
}
function UserReviews({ reviewsData }: ReviewsProps) {
  if (!reviewsData || !reviewsData.ok) return null;
  const { user } = useUser();
  const router = useRouter();

  console.log(reviewsData, user, 123);
  return (
    <div className="divide-y py-7">
      {reviewsData?.reviews?.map((review, i) => (
        <UserReview key={review.id} review={review} />
      ))}
    </div>
  );
}
interface ExtendedReview extends Review {
  user: User;
}
interface UserReviewProps {
  review: ExtendedReview;
}

function UserReview({ review }: UserReviewProps) {
  const { user } = useUser();
  const router = useRouter();
  const [remove, { data: removeResult, loading }] = useMutation<{ ok: boolean }>(
    `/api/users/${router.query.id}/reviews/${review.id}`,
    'DELETE',
  );
  const { data, mutate } = useSWR<ReviewsResponse>(`/api/users/${router.query.id}/reviews`);
  const onDelete = () => {
    if (loading) return;
    remove({});
  };
  const onUpdate = () => {
    router.push(`/users/${router.query.id}/reviews/${review.id}/edit`);
  };
  useEffect(() => {
    if (removeResult && removeResult.ok) {
      if (!data) return;
      mutate({ ...data, reviews: data.reviews.filter((rev) => rev.id !== review.id) });
    }
  }, [removeResult]);
  return (
    <div key={review.id} className="flex w-full justify-between space-x-2 items-start py-3">
      {review?.createdBy?.avatar ? (
        <img
          src={`https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${review?.createdBy?.avatar}/public`}
          className="w-10 h-10 rounded-full bg-slate-500"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-slate-500" />
      )}
      <div className="w-full ">
        <div className="text-sm flex items-start justify-between">
          <div className="cursor-pointer flex items-center space-x-1">
            <span>{review?.createdBy?.name || null}</span>
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
              {+review?.createdById === +(user?.id || -1) ? (
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
        <div className="flex">
          {[1, 1, 1, 1, 1].map((_, i) => (
            <svg
              className={classNames('h-4 w-4', i >= review.score ? 'text-gray-400' : 'text-yellow-400')}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              key={i}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="mt-1">{review.review}</p>

        <div className="flex space-x-1 text-xs text-slate-500">
          <span>3/15</span>
          <span>20:54</span>
        </div>
      </div>
    </div>
  );
}

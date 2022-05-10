import useUser from '@libs/front/hooks/useUser';
import type { NextPage } from 'next';
import useSWR from 'swr';
import { Review, User, PostType } from '@prisma/client';
import { useState } from 'react';
import PostList from '@components/Post/PostList';
import { ExtendedPost, PostListResponse } from '../../typeDefs/post';
import { useRouter } from 'next/router';
import { CFImageUrl } from '@libs/front/cfImage';
import Layout from '@components/layout';
import Link from 'next/link';
interface ExtendedReview extends Review {
  createdBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ExtendedReview[];
}
const Profile: NextPage = () => {
  const { user } = useUser();
  const { data: userPostsData, error } = useSWR<PostListResponse>('/api/users/me/posts');
  const { data: reviewsData } = useSWR<ReviewsResponse>('/api/users/me/reviews');
  const [viewFilter, setViewFilter] = useState<'Lost' | 'Found' | 'UserReview'>('UserReview');
  console.log(user);
  return (
    <Layout pageTitle="내 프로필" canGoBack={true}>
      <div className="flex space-x-4 items-center border-b border-slate-300 pb-4">
        {user?.avatar ? (
          <img src={CFImageUrl(user?.avatar)} className="w-14 h-14 rounded-full bg-slate-500" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-500" />
        )}
        <div className="flex flex-col">
          <span className="font-semibold">{user?.name || null}</span>
          <Link href={'/profile/edit'}>
            <button className="border border-slate-500 text-xs p-1 rounded">프로필 수정</button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2 border-b ">
        <button
          onClick={() => setViewFilter('Lost')}
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

      {viewFilter === 'UserReview' ? (
        <UserReviews reviewsData={reviewsData} />
      ) : (
        <UserPosts userPostsData={userPostsData} viewFilter={viewFilter} />
      )}
    </Layout>
  );
};
export default Profile;

interface UserPostsProps {
  userPostsData: PostListResponse | undefined;
  viewFilter: 'Lost' | 'Found';
}
function UserPosts({ userPostsData, viewFilter }: UserPostsProps) {
  let list: ExtendedPost[];
  if (viewFilter === 'Lost') {
    list = userPostsData?.postList?.filter((post) => post.type === PostType.LOST) || [];
  } else {
    list = userPostsData?.postList?.filter((post) => post.type === PostType.FOUND) || [];
  }
  //GetLostResult 이 받는 interface를 userLostData.losts 만 받게 고치기
  return <>{list ? <PostList postList={list} /> : null}</>;
}
interface ReviewsProps {
  reviewsData: ReviewsResponse | undefined;
}
function UserReviews({ reviewsData }: ReviewsProps) {
  if (!reviewsData || !reviewsData.ok) return null;
  const { user } = useUser();
  const router = useRouter();
  const onDelete = () => {};
  const onUpdate = () => {
    router.push(`/users/${router.query.id}/writeReview`);
  };
  return (
    <div className="divide-y py-7">
      {reviewsData?.reviews?.map((review, i) => (
        <div className="flex w-full justify-between space-x-2 items-start py-3">
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
                  {review?.createdBy?.id === user?.id ? (
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
            <div className="flex space-x-1 text-xs text-slate-500">
              <span>3/15</span>
              <span>20:54</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/*

 <div className="flex  space-x-1 items-start">
            <div className="w-10 h-10 rounded-full bg-slate-500" />
            <div className="flex flex-col  text-sm space-y-2">
              <div>
                <h4>{review?.createdBy.name}</h4>
                <span>{review.createdAt}</span>
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
              </div>
              <div>
                <p>{review?.review}</p>
              </div>
            </div>
          </div>

*/

import useUser from '@libs/front/hooks/useUser';
import type { NextPage } from 'next';
import useSWR from 'swr';
import { Review, User } from '@prisma/client';
import { classNames } from '@libs/front/utils';
import { useState } from 'react';
import GetLostResult from '@components/GetLostResult';
import { ExtendedLost, LostListResponse } from '../../typeDefs/lost';
import { useRouter } from 'next/router';
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
  const { data: userLostsData, error } = useSWR<LostListResponse>(`/api/users/${router.query.id}/losts`);
  const { data: reviewsData } = useSWR<ReviewsResponse>(`/api/users/${router.query.id}/reviews`);
  const [viewFilter, setViewFilter] = useState<'Lost' | 'Found' | 'UserReview'>('UserReview');
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

      {viewFilter === 'Lost' ? <UserLosts userLostsData={userLostsData} /> : null}
      {viewFilter === 'UserReview' ? <UserReviews reviewsData={reviewsData} /> : null}
    </div>
  );
};
export default Profile;

interface UserLostsProps {
  userLostsData: LostListResponse | undefined;
}
function UserLosts({ userLostsData }: UserLostsProps) {
  if (!userLostsData || !userLostsData.ok) return null;
  //GetLostResult 이 받는 interface를 userLostData.losts 만 받게 고치기
  return (
    <>
      <GetLostResult contents={userLostsData} />
    </>
  );
}
interface ReviewsProps {
  reviewsData: ReviewsResponse | undefined;
}
function UserReviews({ reviewsData }: ReviewsProps) {
  if (!reviewsData || !reviewsData.ok) return null;
  return (
    <div className="divide-y py-7">
      {reviewsData?.reviews?.map((review, i) => (
        <div key={i} className="py-3">
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
        </div>
      ))}
    </div>
  );
}

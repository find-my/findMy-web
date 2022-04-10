import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import useMutation from '@libs/front/hooks/useMutation';
import React, { useEffect } from 'react';
import CommentList from '@components/Comment/CommentList';
import useUser from '@libs/front/hooks/useUser';
import { PostDetailResponse, ExtendedComment } from '../../../typeDefs/post';
import { deleteCFImage } from '@libs/front/cfImage';
import { displayTimeForDetail } from '@libs/front/displayTime';
import ScrapButton from '@components/Post/ScrapButton';
import { CFImageUrl } from '@libs/front/cfImage';
import { PostType } from '@prisma/client';
function countRecomments(comments: ExtendedComment[]): number {
  if (!comments || comments === []) return 0;
  let recommentCount = 0;
  comments?.forEach((comment) => (recommentCount += comment?._count?.reComments));
  return recommentCount;
}
const LostDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data } = useSWR<PostDetailResponse>(router.query.id ? `/api/posts/${router.query.id}` : null);
  const [remove, { data: removeResult, loading }] = useMutation(`/api/posts/${router.query.id}`, 'DELETE');
  const deletepost = () => {
    if (loading) return;
    data?.post?.photos?.map(async (photo) => await deleteCFImage(photo?.file));

    remove({});
  };

  useEffect(() => {
    if (removeResult && removeResult.ok) {
      router.push('/losts');
    }
  }, [removeResult]);
  console.log(process.env.IMAGE_DELIVERY);
  useEffect(() => {
    if (!data || (data && !data?.ok)) return;
    if (data?.post?.type === PostType.FOUND) {
      router.push(`/founds/${router.query.id}`);
    }
  }, [data]);
  return (
    <>
      <div>
        {data?.post?.photos[0]?.file ? (
          <img src={CFImageUrl(data?.post?.photos[0]?.file)} className="w-full h-96 bg-slate-500" />
        ) : (
          <div className="w-full h-96 bg-slate-500" />
        )}
      </div>
      <div className="p-4 pb-14">
        <div className="border-b pb-3">
          <div className="flex justify-between items-center space-x-2 border-b pb-3 border-slate-300">
            <div className="flex items-center space-x-2">
              <Link href={`/users/profiles/${data?.post?.user?.id}`}>
                <a>
                  {data?.post?.user?.avatar ? (
                    <img src={CFImageUrl(data?.post?.user?.avatar)} className="w-12 h-12 rounded-full bg-green-500" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-500" />
                  )}
                </a>
              </Link>
              <div>
                <Link href={`/users/profiles/${data?.post?.user?.id}`}>
                  <a>
                    <p className="font-bold text-lg">{data?.post?.user?.name || null}</p>
                  </a>
                </Link>
                <span className="text-sm text-slate-500">
                  {' '}
                  {displayTimeForDetail(data?.post?.createdAt?.toString() || '')}
                </span>
              </div>
            </div>
            {data?.post?.userId === user?.id ? (
              <div className="space-x-2">
                <button className="bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-2 rounded-xl text-white">
                  수정
                </button>
                <button
                  onClick={deletepost}
                  className="bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-2 rounded-xl text-white"
                >
                  삭제
                </button>
              </div>
            ) : (
              <button className="bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-2 rounded-xl text-white">
                작성자에게 채팅 보내기
              </button>
            )}
          </div>

          <div>
            <h1 className="font-bold text-xl ">{data?.post?.title || null}</h1>
            <div className="text-sm text-slate-500">
              <span>카테고리 : </span>
              <span>{data?.post?.category || null}</span>
            </div>
            <div className="text-sm text-slate-500">
              <span>잃어 버린 곳 : </span>
              <span>{data?.post?.place || null}</span>
            </div>
            <p className="mt-7">{data?.post?.description || null}</p>
            <div className="mt-3 flex space-x-2 text-slate-500 items-center">
              <div className="text-black flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
                <span>1</span>
              </div>
              <div className="text-blue-400 flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                <span>{(data?.post?._count?.comments || 0) + countRecomments(data?.post?.comments || []) || null}</span>
              </div>
              <div className="text-yellow-400 flex items-center">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  ></path>
                </svg>
                <span>{data?.post?._count?.scraps || 0}</span>
              </div>
            </div>
            <ScrapButton isScraped={data?.isScraped} />
          </div>
        </div>

        <CommentList />
      </div>
    </>
  );
};

export default LostDetail;

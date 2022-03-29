import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import { Lost, User } from '@prisma/client';
import { classNames } from '@libs/front/utils';
import usePost from '@libs/front/hooks/usePost';
interface ExtendedLost extends Lost {
  user: User;
  _count: {
    scraps: number;
  };
}
interface LostDetailResponse {
  ok: boolean;
  lost: ExtendedLost;
  isScraped: boolean;
}
const LostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate, error } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  console.log(data?.isScraped);
  const [toggleScrap] = usePost(`/api/users/me/scrap/${router.query.id}`);
  const onScrapClick = () => {
    if (!data) return;
    mutate({ ...data, isScraped: !data.isScraped }, false);
    toggleScrap({});
  };
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
  return (
    <>
      <div className="w-full h-96 bg-slate-500" />
      <div className="p-4 pb-14">
        <div className="border-b pb-3">
          <div className="flex items-center space-x-2 border-b pb-4 border-slate-300">
            <Link href={`/users/profiles/${data?.lost?.user?.id}`}>
              <a>
                {' '}
                <div className="w-12 h-12 rounded-full bg-green-500" />
              </a>
            </Link>
            <div>
              <Link href={`/users/profiles/${data?.lost?.user?.id}`}>
                <a>
                  <p className="font-bold text-lg">{data?.lost?.user?.name || null}</p>
                </a>
              </Link>
              <span className="text-sm text-slate-500">
                {' '}
                {displayedAt(data?.lost?.createdAt?.toString() || '') || null}
              </span>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-xl ">{data?.lost?.title || null}</h1>
            <div className="text-sm text-slate-500">
              <span>카테고리 : </span>
              <span>{data?.lost?.category || null}</span>
            </div>
            <div className="text-sm text-slate-500">
              <span>잃어 버린 곳 : </span>
              <span>영통구 영통동</span>
              <span>/</span>
              <span>영통역</span>
            </div>
            <p className="mt-7">{data?.lost?.description || null}</p>
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
                <span>2</span>
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
                <span>{data?.lost._count.scraps || 0}</span>
              </div>
            </div>
            <button onClick={onScrapClick} className=" mt-1  flex space-x-1 items-center p-1 rounded  bg-slate-300">
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
              {data ? <>{data?.isScraped ? <span>스크랩 취소</span> : <span>스크랩</span>}</> : <span>스크랩</span>}
            </button>
          </div>
        </div>
        <div>
          <div>
            {[1, 2].map((_, i) => (
              <div key={i} className="border-b p-2">
                <div className="text-sm flex justify-between">
                  <div className="cursor-pointer flex items-center space-x-1">
                    <div className="w-5 h-5 bg-purple-500 rounded-full" />
                    <span>살찐감자</span>
                  </div>
                  <div>
                    <button className="flex items-center space-x-1 text-slate-500 text-xs">
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
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        ></path>
                      </svg>
                      <span>대댓글 달기</span>
                    </button>
                  </div>
                </div>
                <p className="mt-1">예쁜 지갑이네요 얼른 찾으시길 ㅠㅠ</p>
                <div className="flex space-x-1 text-xs text-slate-500">
                  <span>3/15</span>
                  <span>20:54</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed left-0 bottom-0 z-10 bg-white w-full h-12 shadow grid place-items-center">
          <button className="bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2  hover:bg-blue-500 transition-colors shadow p-3 rounded-xl text-white">
            작성자에게 채팅 보내기
          </button>
        </div>
      </div>
    </>
  );
};

export default LostDetail;

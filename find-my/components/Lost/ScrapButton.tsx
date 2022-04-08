import { useRouter } from 'next/router';
import useSWR from 'swr';
import useMutation from '@libs/front/hooks/useMutation';
import React from 'react';

import { LostDetailResponse } from '../../typeDefs/lost';

interface Props {
  isScraped: boolean | undefined;
}
function ScrapButton({ isScraped }: Props) {
  const router = useRouter();
  const { data, mutate } = useSWR<LostDetailResponse>(router.query.id ? `/api/losts/${router.query.id}` : null);
  const [toggleScrap] = useMutation(`/api/users/me/scraps/${router.query.id}`, 'POST');

  const onScrapClick = () => {
    if (!data) return;
    mutate(
      {
        ...data,
        lost: {
          ...data.lost,
          _count: {
            ...data.lost._count,
            scraps: data.isScraped ? data.lost?._count?.scraps - 1 : data?.lost?._count?.scraps + 1,
          },
        },
        isScraped: !data.isScraped,
      },
      false,
    );

    toggleScrap({});
  };

  return (
    <button onClick={onScrapClick} className=" mt-1  flex space-x-1 items-center p-1 rounded  bg-slate-300">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        ></path>
      </svg>
      <span>{isScraped ? <>스크랩 취소</> : <>스크랩</>}</span>
    </button>
  );
}

export default React.memo(ScrapButton);

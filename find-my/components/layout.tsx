import React from 'react';
import ServiceLogo from '@components/ServiceLogo';
import { classNames } from '../libs/front/utils';
import Link from 'next/link';
import useUser from '@libs/front/hooks/useUser';
import { CFImageUrl } from '@libs/front/cfImage';
import { useRouter } from 'next/router';
interface LayoutProps {
  logoDisplay?: boolean;
  pageTitle?: string;
  canGoBack?: boolean;
  hasTabBar?: boolean;
  children: React.ReactNode;
}

export default function Layout({ pageTitle = '', logoDisplay = false, canGoBack, hasTabBar, children }: LayoutProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const onGoBack = () => {
    router.back();
  };
  return (
    <div>
      <div className="bg-white w-full text-lg font-medium py-2 px-3 fixed text-gray-800 border-b top-0 justify-between flex items-center">
        {canGoBack ? (
          <button onClick={onGoBack}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
        ) : null}
        {logoDisplay ? <ServiceLogo textSize="text-4xl" /> : <span>{pageTitle}</span>}
        {true ? (
          <Link href="/profile">
            <svg
              className="w-7 h-7 text-gray-500 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </Link>
        ) : (
          <div className="text-sm font-semibold space-x-2 flex items-center">
            <div>
              <Link href="/login">
                <a>로그인</a>
              </Link>
            </div>
            <div className="bg-blue-400 rounded text-white p-1">
              <Link href="/signup">
                <a>회원가입</a>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className={classNames('pt-14', hasTabBar ? 'pb-16' : '', router?.pathname === '/' ? '' : 'px-4')}>
        {children}
      </div>
      {true ? (
        <nav className="bg-white text-gray-700 border-t fixed bottom-0 w-full px-10 py-2 flex z-50 justify-between text-xs">
          <Link href="/">
            <a className="flex flex-col items-center space-y-1">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <span>홈</span>
            </a>
          </Link>
          <Link href="/losts">
            <a className="flex flex-col items-center space-y-1">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>분실물</span>
            </a>
          </Link>
          <Link href="/founds">
            <a className="flex flex-col items-center space-y-1">
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>습득물</span>
            </a>
          </Link>
          <Link href="/chats">
            <a className="flex flex-col items-center space-y-1">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>채팅</span>
            </a>
          </Link>
        </nav>
      ) : null}
    </div>
  );
}

//useUser.ts
//로그인된 유저의 정보와, 데이터를 불러오고 있는 loading 상태인지를 리턴함
//유저가 로그인 되있지 않으면 login으로 리턴함.
//로그인후 접근하려고 했던 페이지로 리다이랙트하는 방식으로 고칠 예정
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { User } from '@prisma/client';
interface UserResponse {
  ok: boolean;
  userData: User;
}
export default function useUser() {
  const { data, error } = useSWR<UserResponse>('/api/users/me');
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/login');
    }
  }, [data, router]);
  return { user: data?.userData, isLoading: !data && !error };
}

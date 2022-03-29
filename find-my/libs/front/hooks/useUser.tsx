import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function useFetchUser() {
  const { data, error } = useSWR('/api/users/user', {
    dedupingInterval: 2000, // 2초
  });
  const { data: isLoggedIn, mutate: toggle } = useSWR<boolean>('isLoggedIn');
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace('/login');
    }
  }, [data, router]);
  return { user: data?.userData, isLoading: !data && !error };
}

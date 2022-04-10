import { PostType } from '@prisma/client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

type ResultType<T> = { data: T; isLoading: boolean };
function useSearch<T = any>(searchTerm: string, postType: PostType): ResultType<T> {
  const { data, error } = useSWR(
    postType === PostType.LOST ? `/api/posts/search/losts/${searchTerm}` : `/api/posts/search/founds/${searchTerm}`,
  );
  useEffect(() => {
    console.log(data);
  }, []);
  return { data: data, isLoading: !data && !error };
}

export default useSearch;

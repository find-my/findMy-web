import { useEffect, useState } from 'react';
import useSWR from 'swr';

type ResultType<T> = { data: T; isLoading: boolean };
function useSearch<T = any>(searchTerm: string): ResultType<T> {
  const { data, error } = useSWR(`/api/losts/search/${searchTerm}`);
  useEffect(() => {
    console.log(data);
  }, []);
  return { data: data, isLoading: !data && !error };
}

export default useSearch;

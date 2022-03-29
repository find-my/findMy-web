import { useEffect, useState } from 'react';
import useSWR from 'swr';
function Search(searchTerm: string) {
  const { data, error } = useSWR(`/api/losts/search/${searchTerm}`);

  return { data: data?.result, isLoading: !data && !error };
}

export default Search;

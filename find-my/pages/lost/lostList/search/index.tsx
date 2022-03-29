import type { NextPage } from 'next';
import useSWR from 'swr';
import useUser from '@libs/front/hooks/useUser';
import { useEffect } from 'react';
import { Lost, User } from '@prisma/client';
import useSearch from '@libs/front/hooks/useSearch';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import GetLostResult from '@components/GetLostResult';
import { withRouter, NextRouter } from 'next/router';
import SearchInput from '@components/SearchInput';
interface LostWithUser extends Lost {
  user: User;
}
interface LostDetailResponse {
  ok: boolean;
  lostList: LostWithUser[];
}
interface WithRouterProps {
  router: NextRouter;
}
const LostSearch = ({ router }: WithRouterProps) => {
  const {
    query: { searchTerm },
  } = router;
  const { data: searchResult, isLoading } = useSearch<LostDetailResponse>(searchTerm?.toString() || '');
  console.log(searchTerm);
  return (
    <>
      <SearchInput />
      {isLoading ? null : <GetLostResult contents={searchResult} />}
    </>
  );
};

export default withRouter(LostSearch);
//

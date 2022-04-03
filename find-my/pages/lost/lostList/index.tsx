import { NextPage } from 'next';
import SearchInput from '@components/SearchInput';
import useSWR from 'swr';
import GetLostResult from '@components/GetLostResult';
import { Lost, User } from '@prisma/client';
import { LostListResponse } from '../../../typeDefs/lost';

const LostList: NextPage = () => {
  const { data, error } = useSWR<LostListResponse>('/api/losts');
  return (
    <>
      <SearchInput />
      {data ? <GetLostResult contents={data} /> : null}
    </>
  );
};

export default LostList;

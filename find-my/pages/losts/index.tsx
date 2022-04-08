import { NextPage } from 'next';
import SearchInput from '@components/SearchInput';
import useSWR from 'swr';
import LostList from '@components/Lost/LostList';
import { LostListResponse } from '../../typeDefs/lost';

const Losts: NextPage = () => {
  const { data } = useSWR<LostListResponse>('/api/losts');
  return (
    <>
      <SearchInput />
      {data ? <LostList lostList={data.lostList} /> : null}
    </>
  );
};

export default Losts;

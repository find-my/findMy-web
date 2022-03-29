import { NextPage } from 'next';
import SearchInput from '@components/SearchInput';
import useSWR from 'swr';
import GetLostResult from '@components/GetLostResult';
import { Lost, User } from '@prisma/client';
interface LostWithUser extends Lost {
  user: User;
}
interface LostDetailResponse {
  ok: boolean;
  lostList: LostWithUser[];
}
const LostList: NextPage = () => {
  const { data, error } = useSWR<LostDetailResponse>('/api/losts');
  return (
    <>
      <SearchInput />
      {data ? <GetLostResult contents={data} /> : null}
    </>
  );
};

export default LostList;

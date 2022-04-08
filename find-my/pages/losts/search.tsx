import useSearch from '@libs/front/hooks/useSearch';
import GetLostResult from '@components/Lost/LostList';
import { withRouter, NextRouter } from 'next/router';
import SearchInput from '@components/SearchInput';
import { LostListResponse } from '../../typeDefs/lost';

interface WithRouterProps {
  router: NextRouter;
}
const LostSearch = ({ router }: WithRouterProps) => {
  const {
    query: { searchTerm },
  } = router;
  const { data: searchResult, isLoading } = useSearch<LostListResponse>(searchTerm?.toString() || '');
  console.log(searchTerm);
  return (
    <>
      <SearchInput />
      {isLoading ? null : <GetLostResult contents={searchResult} />}
    </>
  );
};

export default withRouter(LostSearch);

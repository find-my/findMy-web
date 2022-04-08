import useSearch from '@libs/front/hooks/useSearch';
import LostList from '@components/Lost/LostList';
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

  return (
    <>
      <SearchInput />
      {isLoading ? null : <LostList lostList={searchResult.lostList} />}
    </>
  );
};

export default withRouter(LostSearch);

import useSearch from '@libs/front/hooks/useSearch';
import PostList from '@components/Post/PostList';
import { withRouter, NextRouter } from 'next/router';
import SearchInput from '@components/SearchInput';
import { PostListResponse } from '../../typeDefs/post';

interface WithRouterProps {
  router: NextRouter;
}
const PostSearch = ({ router }: WithRouterProps) => {
  const {
    query: { searchTerm },
  } = router;
  const { data: searchResult, isLoading } = useSearch<PostListResponse>(searchTerm?.toString() || '');

  return (
    <>
      <SearchInput />
      {isLoading ? null : <PostList postList={searchResult.postList} />}
    </>
  );
};

export default withRouter(PostSearch);

import useSearch from '@libs/front/hooks/useSearch';
import PostList from '@components/Post/PostList';
import { withRouter, NextRouter } from 'next/router';
import SearchInput from '@components/SearchInput';
import { PostListResponse } from '../../typeDefs/post';
import { PostType } from '@prisma/client';
import Layout from '@components/layout';
interface WithRouterProps {
  router: NextRouter;
}
const PostSearch = ({ router }: WithRouterProps) => {
  const {
    query: { searchTerm },
  } = router;
  const { data: searchResult, isLoading } = useSearch<PostListResponse>(searchTerm?.toString() || '', PostType.LOST);

  return (
    <Layout canGoBack={true} pageTitle="분실물 검색">
      <SearchInput urlType="losts" />
      {searchResult && searchResult.ok ? <PostList postList={searchResult.postList} /> : null}
    </Layout>
  );
};

export default withRouter(PostSearch);

import { NextPage } from 'next';
import SearchInput from '@components/SearchInput';
import useSWR from 'swr';
import PostList from '@components/Post/PostList';
import { PostListResponse } from '../../typeDefs/post';

const Losts: NextPage = () => {
  const { data } = useSWR<PostListResponse>('/api/losts');
  return (
    <>
      <SearchInput />
      {data ? <PostList postList={data.postList} /> : null}
    </>
  );
};

export default Losts;

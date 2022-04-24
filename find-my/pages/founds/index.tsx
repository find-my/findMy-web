import { NextPage } from 'next';
import SearchInput from '@components/SearchInput';
import useSWR from 'swr';
import PostList from '@components/Post/PostList';
import { ExtendedPost, PostListResponse } from '../../typeDefs/post';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import Layout from '@components/layout';
const Losts: NextPage = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    triggerOnce: true,
  });

  // 서버에서 아이템을 가지고 오는 함수

  const getPosts = useCallback(() => {
    setLoading(true);

    fetch(`/api/founds?page=${page}`)
      .then((response) => response.json().catch(() => {}))
      .then((data: PostListResponse) => {
        if (!data.ok) return;
        setPosts((prev) => [...prev, ...data.postList]);
      })
      .catch((error) => console.log(error));

    setLoading(false);
  }, [page]);

  // `getItems` 가 바뀔 때 마다 함수 실행
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => {
    // 사용자가 마지막 요소를 보고 있고, 로딩 중이 아니라면
    if (inView && !loading) {
      setPage((prev) => prev + 1);
    }
    console.log(inView);
  }, [inView, loading]);
  return (
    <Layout canGoBack={true} pageTitle="습득물 목록">
      <SearchInput urlType="losts" />
      {posts ? <PostList postList={posts} inViewRef={ref} /> : null}
    </Layout>
  );
};

export default Losts;

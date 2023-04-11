import { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, store } from '@/store';
import { startLoadingPosts } from '@/store/post/thunks';
import { Post } from '@/interfaces/post';
import PostTable from '@/components/post/PostTable';

import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  postList: Post[];
}

const Home: NextPage<Props> = ({ postList }) => {
  const dispatch = useDispatch();
  const { active: post, posts } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    dispatch(startLoadingPosts());
  }, []);

  return <PostTable postList={posts} />;
};

export default Home;

import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { ContentPage } from '@comp/page/content';
import { Post } from 'src/types/posts';

interface ContentPageProps {
  qiitaPosts: Post[];
  zennPosts: Post[];
  error?: string;
}

const Content: NextPage<ContentPageProps> = (props) => {
  return <ContentPage {...props} />;
};

export const getStaticProps: GetStaticProps<ContentPageProps> = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }/api/content`);
    const data = await res.json();

    if ('error' in data) {
      throw new Error(data.error);
    }

    return {
      props: {
        qiitaPosts: data.qiitaPosts,
        zennPosts: data.zennPosts,
      },
      revalidate: 3600,
    };
  } catch (error: any) {
    return {
      props: {
        qiitaPosts: [],
        zennPosts: [],
        error: error.message || '記事の取得中にエラーが発生しました。',
      },
      revalidate: 3600,
    };
  }
};

export default Content;

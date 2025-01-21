import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import { ContentPage } from '@comp/page/content';
import { useBizPage } from '@comp/context';

interface Post {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  liked_count?: number;
  created_at: string;
  updated_at: string;
  body_updated_at?: string;
  published_at?: string;
  slug?: string;
}

interface ContentPageProps {
  qiitaPosts: Post[];
  zennPosts: Post[];
  error?: string;
}

const BizContent: NextPage<ContentPageProps> = (props) => {
  useBizPage();

  return <ContentPage {...props} />;
};

export const getStaticProps: GetStaticProps<ContentPageProps> = async () => {
  try {
    if (!process.env.QIITA_ACCESS_TOKEN || !process.env.YOUR_ZENN_USERNAME) {
      throw new Error('環境変数が設定されていません。');
    }

    const [qiitaResponse, zennResponse] = await Promise.all([
      axios.get<Post[]>('https://qiita.com/api/v2/authenticated_user/items', {
        headers: {
          Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
        },
      }),
      axios.get<{ articles: Post[] }>(
        `https://zenn.dev/api/articles?username=${process.env.YOUR_ZENN_USERNAME}`
      ),
    ]);

    return {
      props: {
        qiitaPosts: qiitaResponse.data,
        zennPosts: zennResponse.data.articles.map((item) => ({
          ...item,
          likes_count: item.liked_count || 0,
          created_at: item.published_at || item.created_at,
          updated_at: item.body_updated_at || item.updated_at,
          url: `https://zenn.dev/${process.env.YOUR_ZENN_USERNAME}/articles/${item.slug}`,
        })),
      },
      revalidate: 3600, // 1時間ごとに再生成
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        qiitaPosts: [],
        zennPosts: [],
        error:
          error instanceof Error
            ? error.message
            : '記事の取得中にエラーが発生しました。',
      },
      revalidate: 3600,
    };
  }
};

export default BizContent;

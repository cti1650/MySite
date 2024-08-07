import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import axios from 'axios';

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

const ContentPage: React.FC<ContentPageProps> = ({ qiitaPosts, zennPosts, error }) => {
  const [formattedQiitaPosts, setFormattedQiitaPosts] = useState<Post[]>([]);
  const [formattedZennPosts, setFormattedZennPosts] = useState<Post[]>([]);

  useEffect(() => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatPosts = (posts: Post[]) => posts.map(post => ({
      ...post,
      created_at: formatDate(post.created_at),
      updated_at: formatDate(post.updated_at)
    }));

    setFormattedQiitaPosts(formatPosts(qiitaPosts));
    setFormattedZennPosts(formatPosts(zennPosts));
  }, [qiitaPosts, zennPosts]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Content</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const renderDateInfo = (post: Post) => {
    if (post.created_at === post.updated_at) {
      return <p className="text-xs text-gray-500">公開日: {post.created_at}</p>;
    }
    return (
      <p className="text-xs text-gray-500">
        公開日: {post.created_at} / 更新日: {post.updated_at}
      </p>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Content</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Qiita Posts</h2>
          {formattedQiitaPosts.length > 0 ? (
            <ul className="space-y-4">
              {formattedQiitaPosts.map((post) => (
                <li key={post.id} className="border p-4 rounded-lg">
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {post.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Likes: {post.likes_count}</p>
                  {renderDateInfo(post)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Qiitaの記事を取得できませんでした。</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Zenn Posts</h2>
          {formattedZennPosts.length > 0 ? (
            <ul className="space-y-4">
              {formattedZennPosts.map((post) => (
                <li key={post.id} className="border p-4 rounded-lg">
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {post.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Likes: {post.likes_count}</p>
                  {renderDateInfo(post)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Zennの記事を取得できませんでした。</p>
          )}
        </div>
      </div>
    </div>
  );
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
      axios.get<{ articles: Post[] }>(`https://zenn.dev/api/articles?username=${process.env.YOUR_ZENN_USERNAME}`),
    ]);

    return {
      props: {
        qiitaPosts: qiitaResponse.data,
        zennPosts: zennResponse.data.articles.map(item => ({
          ...item,
          likes_count: item.liked_count || 0,
          created_at: item.published_at || item.created_at,
          updated_at: item.body_updated_at || item.updated_at,
          url: `https://zenn.dev/${process.env.YOUR_ZENN_USERNAME}/articles/${item.slug}`
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
        error: error instanceof Error ? error.message : '記事の取得中にエラーが発生しました。'
      },
      revalidate: 3600,
    };
  }
};

export default ContentPage;
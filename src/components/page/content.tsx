import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Anchor,
  Group,
  Badge,
} from '@mantine/core';
import { useBizPath } from '@comp/context';

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

export const ContentPage: React.FC<ContentPageProps> = ({
  qiitaPosts,
  zennPosts,
  error,
}) => {
  const [formattedQiitaPosts, setFormattedQiitaPosts] = useState<Post[]>([]);
  const [formattedZennPosts, setFormattedZennPosts] = useState<Post[]>([]);
  const path = useBizPath();

  useEffect(() => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatAndSortPosts = (posts: Post[]) =>
      posts
        .map((post) => ({
          ...post,
          created_at: formatDate(post.created_at),
          updated_at: formatDate(post.updated_at),
        }))
        .sort((a, b) => b.likes_count - a.likes_count);

    setFormattedQiitaPosts(formatAndSortPosts(qiitaPosts));
    setFormattedZennPosts(formatAndSortPosts(zennPosts));
  }, [qiitaPosts, zennPosts]);

  if (error) {
    return (
      <Container>
        <Title order={1} mb="md">
          My Content
        </Title>
        <Text color="red">{error}</Text>
      </Container>
    );
  }

  const renderDateInfo = (post: Post) => {
    if (post.created_at === post.updated_at) {
      return (
        <Text size="xs" color="dimmed">
          公開日: {post.created_at}
        </Text>
      );
    }
    return (
      <Text size="xs" color="dimmed">
        公開日: {post.created_at} / 更新日: {post.updated_at}
      </Text>
    );
  };

  const renderPostList = (posts: Post[], title: string) => (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={2} mb="md">
        {title}
      </Title>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} shadow="xs" p="md" radius="md" withBorder mb="sm">
            <Anchor href={post.url} target="_blank" rel="noopener noreferrer">
              <Text weight={500}>{post.title}</Text>
            </Anchor>
            <Group position="apart" mt="xs">
              <Badge color="blue" variant="light">
                Likes: {post.likes_count}
              </Badge>
              {renderDateInfo(post)}
            </Group>
          </Card>
        ))
      ) : (
        <Text>記事を取得できませんでした。</Text>
      )}
    </Card>
  );

  return (
    <Container size="lg" py="xl">
      <Head>
        <title>cti1650 Contents</title>
        <meta property="og:title" content="cti1650 Contents" />
        <meta property="og:site_name" content="cti1650 Contents" />
        <meta name="description" content="cti1650が執筆した記事です。" />
        <meta property="og:description" content="cti1650が執筆した記事です。" />
        <meta
          property="og:url"
          content={path}
        />
      </Head>
      <Title order={1} mb="xl">
        My Content
      </Title>
      <Grid>
        <Grid.Col span={12} md={6}>
          {renderPostList(formattedQiitaPosts, 'Qiita Posts')}
        </Grid.Col>
        <Grid.Col span={12} md={6}>
          {renderPostList(formattedZennPosts, 'Zenn Posts')}
        </Grid.Col>
      </Grid>
    </Container>
  );
};
import { ContentPage } from '@comp/page/content';
import { fetchContent } from '@lib/contentApi';
import type { GetStaticProps, NextPage } from 'next';
import type { Post } from 'src/types/posts';

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
    const result = await fetchContent();

    if ('error' in result) {
      throw new Error(result.error);
    }

    return {
      props: {
        ...result,
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

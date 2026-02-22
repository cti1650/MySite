import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
import { ContentPage } from '@comp/page/content';
import { fetchContent } from '@lib/contentApi';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { Post } from 'src/types/posts';

interface ContentPageProps {
  qiitaPosts: Post[];
  zennPosts: Post[];
  error?: string;
}

const ViewLayerContent: NextPage<ContentPageProps> = (props) => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <ContentPage {...props} />
    </ViewLayerPageContainer>
  );
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

export async function getStaticPaths() {
  return {
    paths: viewSocialLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default ViewLayerContent;

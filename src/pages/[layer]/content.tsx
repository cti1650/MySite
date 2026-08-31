import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { ContentPage } from '@comp/page/content';
import { createPageProps, fetchContentPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
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

export const getServerSideProps = createPageProps({
  layers: viewLayerList,
  fetchProps: fetchContentPageProps,
  sMaxAge: 3600,
});

export default ViewLayerContent;

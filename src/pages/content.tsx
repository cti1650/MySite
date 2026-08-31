import { ContentPage } from '@comp/page/content';
import { createPageProps, fetchContentPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import type { Post } from 'src/types/posts';

interface ContentPageProps {
  qiitaPosts: Post[];
  zennPosts: Post[];
  error?: string;
}

const Content: NextPage<ContentPageProps> = (props) => {
  return <ContentPage {...props} />;
};

export const getServerSideProps = createPageProps({
  fetchProps: fetchContentPageProps,
  sMaxAge: 3600,
});

export default Content;

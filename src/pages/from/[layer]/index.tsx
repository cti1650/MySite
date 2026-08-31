import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
import { TopPage } from '@comp/page/top';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerFromHome: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <TopPage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({
  layers: viewSocialLayerList,
});

export default ViewLayerFromHome;

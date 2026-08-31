import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { TopPage } from '@comp/page/top';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerHome: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <TopPage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({ layers: viewLayerList });

export default ViewLayerHome;

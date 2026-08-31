import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerTermsOfService: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <TermsOfServicePage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({ layers: viewLayerList });

export default ViewLayerTermsOfService;

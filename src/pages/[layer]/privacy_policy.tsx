import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerPrivacyPolicy: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <PrivacyPolicyPage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({ layers: viewLayerList });

export default ViewLayerPrivacyPolicy;

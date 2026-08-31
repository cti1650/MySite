import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerFromPrivacyPolicy: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <PrivacyPolicyPage />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({
  layers: viewSocialLayerList,
});

export default ViewLayerFromPrivacyPolicy;

import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';

const PrivacyPolicy: NextPage = () => {
  return <PrivacyPolicyPage />;
};

export const getServerSideProps = createPageProps();

export default PrivacyPolicy;

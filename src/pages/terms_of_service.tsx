import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';

const TermsOfService: NextPage = () => {
  return <TermsOfServicePage />;
};

export const getServerSideProps = createPageProps();

export default TermsOfService;

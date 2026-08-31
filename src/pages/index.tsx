import { TopPage } from '@comp/page/top';
import { createPageProps } from '@lib/pageProps';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return <TopPage />;
};

export const getServerSideProps = createPageProps();

export default Home;

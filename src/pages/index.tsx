import { TopPage } from '@comp/page/top';
import type { GetStaticProps, NextPage } from 'next';

const Home: NextPage = () => {
  return <TopPage />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default Home;

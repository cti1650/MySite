/* eslint-disable jsx-a11y/img-redundant-alt */

import { SitePage } from '@comp/page/site';
import { fetchPortfolios, type ResponseData } from '@lib/portfolioApi';
import type { GetStaticProps, NextPage } from 'next';

const Site: NextPage = (props: any) => {
  const { portfolios } = props;

  return <SitePage portfolios={portfolios} />;
};

// SSRの場合
// export const getServerSideProps: GetServerSideProps = async (context) => {

// SSGの場合
export const getStaticProps: GetStaticProps = async () => {
  let portfolios: ResponseData = [];
  try {
    portfolios = await fetchPortfolios();
    console.log('portfolios', portfolios);
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      portfolios: Array.isArray(portfolios) ? portfolios : [],
    },
    revalidate: 60 * 5,
  };
};

export default Site;

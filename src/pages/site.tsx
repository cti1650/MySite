import { SitePage } from '@comp/page/site';
import { fetchPortfolios, type ResponseData } from '@lib/portfolioApi';
import type { GetStaticProps, NextPage } from 'next';

interface SiteProps {
  portfolios: ResponseData;
}

const Site: NextPage<SiteProps> = ({ portfolios }) => {
  return <SitePage portfolios={portfolios} />;
};

// SSRの場合
// export const getServerSideProps: GetServerSideProps = async (context) => {

// SSGの場合
export const getStaticProps: GetStaticProps = async () => {
  let portfolios: ResponseData = [];
  try {
    portfolios = await fetchPortfolios();
  } catch {
    // fetchPortfolios handles its own error logging
  }

  return {
    props: {
      portfolios: Array.isArray(portfolios) ? portfolios : [],
    },
    revalidate: 60 * 5,
  };
};

export default Site;

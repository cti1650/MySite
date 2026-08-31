import { SitePage } from '@comp/page/site';
import { createPageProps, fetchSitePageProps } from '@lib/pageProps';
import type { ResponseData } from '@lib/portfolioApi';
import type { NextPage } from 'next';

interface SiteProps {
  portfolios: ResponseData;
}

const Site: NextPage<SiteProps> = ({ portfolios }) => {
  return <SitePage portfolios={portfolios} />;
};

export const getServerSideProps = createPageProps({
  fetchProps: fetchSitePageProps,
  sMaxAge: 60 * 5,
});

export default Site;

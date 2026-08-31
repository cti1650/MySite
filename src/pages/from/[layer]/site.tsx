import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
import { SitePage } from '@comp/page/site';
import { createPageProps, fetchSitePageProps } from '@lib/pageProps';
import type { ResponseData } from '@lib/portfolioApi';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

interface SiteProps {
  portfolios: ResponseData;
}

const ViewLayerFromSite: NextPage<SiteProps> = ({ portfolios }) => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <SitePage portfolios={portfolios} />
    </ViewLayerPageContainer>
  );
};

export const getServerSideProps = createPageProps({
  layers: viewSocialLayerList,
  fetchProps: fetchSitePageProps,
  sMaxAge: 60 * 5,
});

export default ViewLayerFromSite;

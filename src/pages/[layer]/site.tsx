/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { fetchPortfolios, ResponseData } from '@lib/portfolioApi';
import { SitePage } from '@comp/page/site';
import { viewLayerList, ViewLayerPageContainer } from '@comp/context';
import { useRouter } from 'next/router';

const ViewLayerSite: NextPage = (props: any) => {
  const { portfolios } = props;
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <SitePage portfolios={portfolios} />
    </ViewLayerPageContainer>
  );
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

export async function getStaticPaths() {
  return {
    paths: viewLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default ViewLayerSite;

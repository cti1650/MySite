/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { fetchPortfolios, ResponseData } from '@lib/portfolioApi';
import { SitePage } from '@comp/page/site';
import { LibePageContainer } from '@comp/context';

const LibeSite: NextPage = (props: any) => {
  const { portfolios } = props;

  return (
    <LibePageContainer>
      <SitePage portfolios={portfolios} />
    </LibePageContainer>
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

export default LibeSite;

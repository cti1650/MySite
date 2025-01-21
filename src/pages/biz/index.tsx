import React from 'react';
import { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { useBizPage } from '@comp/context';
import { TopPage } from '@comp/page/top';

const BizHome: NextPage = () => {
  useBizPage();

  return <TopPage />;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default BizHome;

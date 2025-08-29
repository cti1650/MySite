import React from 'react';
import { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { LibePageContainer } from '@comp/context';
import { TopPage } from '@comp/page/top';

const LibeHome: NextPage = () => {
  return (
    <LibePageContainer>
      <TopPage />
    </LibePageContainer>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default LibeHome;

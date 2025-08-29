import React from 'react';
import { NextPage } from 'next';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { LibePageContainer } from '@comp/context';

const LibeTermsOfService: NextPage = () => {
  return (
    <LibePageContainer>
      <TermsOfServicePage />
    </LibePageContainer>
  );
};

export default LibeTermsOfService;

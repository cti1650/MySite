import React from 'react';
import { NextPage } from 'next';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { BizPageContainer } from '@comp/context';

const BizTermsOfService: NextPage = () => {
  return (
    <BizPageContainer>
      <TermsOfServicePage />
    </BizPageContainer>
  );
};

export default BizTermsOfService;

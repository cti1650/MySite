import React from 'react';
import { NextPage } from 'next';
import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { BizPageContainer } from '@comp/context';

const BizPrivacyPolicy: NextPage = () => {
  return (
    <BizPageContainer>
      <PrivacyPolicyPage />
    </BizPageContainer>
  );
};

export default BizPrivacyPolicy;

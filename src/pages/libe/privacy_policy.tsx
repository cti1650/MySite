import React from 'react';
import { NextPage } from 'next';
import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { LibePageContainer } from '@comp/context';

const LibePrivacyPolicy: NextPage = () => {
  return (
    <LibePageContainer>
      <PrivacyPolicyPage />
    </LibePageContainer>
  );
};

export default LibePrivacyPolicy;

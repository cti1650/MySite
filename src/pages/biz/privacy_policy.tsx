import React from 'react';
import { NextPage } from 'next';
import { PrivacyPolicyPage } from '@comp/page/privacyPolicy';
import { useBizPage } from '@comp/context';

const BizPrivacyPolicy: NextPage = () => {
  useBizPage();

  return <PrivacyPolicyPage />;
};

export default BizPrivacyPolicy;

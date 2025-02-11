import React from 'react';
import { NextPage } from 'next';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { useBizPage } from '@comp/context';

const BizTermsOfService: NextPage = () => {
  useBizPage();

  return <TermsOfServicePage />;
};

export default BizTermsOfService;

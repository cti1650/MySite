import React from 'react';
import { NextPage } from 'next';
import { ContactPage } from '@comp/page/contact';
import { useBizPage } from '@comp/context';

const BizContact: NextPage = () => {
  useBizPage();

  return <ContactPage />;
};

export default BizContact;

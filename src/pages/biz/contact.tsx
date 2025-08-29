import React from 'react';
import { NextPage } from 'next';
import { ContactPage } from '@comp/page/contact';
import { BizPageContainer } from '@comp/context';

const BizContact: NextPage = () => {
  return (
    <BizPageContainer>
      <ContactPage />
    </BizPageContainer>
  );
};

export default BizContact;

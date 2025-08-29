import React from 'react';
import { NextPage } from 'next';
import { ContactPage } from '@comp/page/contact';
import { LibePageContainer } from '@comp/context';

const LibeContact: NextPage = () => {
  return (
    <LibePageContainer>
      <ContactPage />
    </LibePageContainer>
  );
};

export default LibeContact;

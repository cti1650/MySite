import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import {
  Container
} from '@material-ui/core';
import { MantineForm } from '@comp/form/mantineForm';

const Contact: NextPage = () => {
  return (
    <div className="w-full px-10 font-n2i">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>
      <Container maxWidth="xs" className="pt-[30px]">
        <MantineForm />
      </Container>
    </div>
  );
};

export default Contact;

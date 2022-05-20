import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { MantineForm } from '@comp/form/mantineForm';

const Contact: NextPage = () => {
  return (
    <div className="w-full h-full font-n2i">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>
      <div className='h-full w-full flex justify-center items-center px-4 font-n2i'>
        <MantineForm />
      </div>
    </div>
  );
};

export default Contact;

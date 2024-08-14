import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { MantineForm } from '@comp/form/mantineForm';

const Contact: NextPage = () => {
  return (
    <div className="w-full h-full font-n2i">
      <Head>
        <title>cti1650 Contact</title>
        <meta property="og:title" content="cti1650 Contact" />
        <meta property="og:site_name" content="cti1650 Contact" />
        <meta
          name="description"
          content="cti1650へのご質問、ご依頼、その他お問い合わせフォームです。"
        />
        <meta
          property="og:description"
          content="cti1650へのご質問、ご依頼、その他お問い合わせフォームです。"
        />
      </Head>
      <div className="h-full w-full px-4 font-n2i">
        <MantineForm />
      </div>
    </div>
  );
};

export default Contact;

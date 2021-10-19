import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

const Home = () => {
  return (
    <div className='w-full px-10 font-n2i'>
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property='og:title' content='MySite' />
      </Head>

      <div className='w-full text-gray-900 pt-2 grid grid-rows-2 sm:grid-cols-2'>
        <div className="w-full">
          <img src="https://pakutaso.cdn.rabify.me/shared/img/thumb/084AME0226.jpg.webp?d=1420" alt="image" className="w-full" />
        </div>
        <div className="w-full">

        </div>
      </div>
    </div>
  );
};

// https://n2i.jp/

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {},
  };
}

export default Home;

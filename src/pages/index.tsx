import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

const Home = () => {
  return (
    <div className='w-full px-10 font-n2i'>
      <Head>
        <title>MySite</title>
        <meta property='og:title' content='MySite' />
      </Head>

      <div className='w-full text-gray-900 py-4'>
        <div>
          <div className='sticky text-lg font-bold pt-4'>Box Layout</div>
          <img src="https://pakutaso.cdn.rabify.me/shared/img/thumb/084AME0226.jpg.webp?d=1420" alt="image" />
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

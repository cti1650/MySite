import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useAge } from '@hooks/useAge';

const Home = () => {
  const { age } = useAge(1992, 1, 25);
  return (
    <div className='w-full px-10 font-n2i'>
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property='og:title' content='MySite' />
      </Head>

      <div className='w-full text-gray-900 mt-4 pt-2 grid sm:grid-cols-2'>
        <div className="w-full">
          <img src="https://pakutaso.cdn.rabify.me/shared/img/thumb/084AME0226.jpg.webp?d=1420" alt="image" className="w-full" />
        </div>
        <div className="w-full flex flex-col pl-4">
          <div className="text-xl text-blue-700 pt-4">Profile</div>
          <div className="w-full flex flex-col pl-4">
            <div className="text-lg text-blue-500 pt-4">Name</div>
            <div className="pl-4 text-gray-600">Yuichi Sakagami</div>
            <div className="text-lg text-blue-500 pt-4">Birthday</div>
            <div className="pl-4 text-gray-600">1992年1月25日 ( {age}歳 )</div>
            <div className="text-lg text-blue-500 pt-4">Skillset</div>
            <div className="pl-4 text-gray-600">HTML, JavaScript, CSS, React.js, Next.js, Tailwind.css</div>
            <div className="text-lg text-blue-500 pt-4">Qualification & Tools</div>
            <div className="pl-4 text-gray-600">ITパスポート, GitHub, VSCode</div>
          </div>
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

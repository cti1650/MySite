import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

const birthday = {
  year: 1992,
  month: 1,
  date: 25
};

const getAge = (birthday) => {
  //今日
  const today = new Date();
  //今年の誕生日
  const thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);
  //年齢
  const age = today.getFullYear() - birthday.year;
  if(today < thisYearsBirthday){
      //今年まだ誕生日が来ていない
      age--;
  }
  return age;
};

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
        <div className="w-full flex flex-col">
          <div className="text-xl text-blue-700">Profile</div>
          <div className="text-lg text-blue-500">Name</div>
          <div className="text-gray-600">Yuichi Sakagami</div>
          <div className="text-lg text-blue-500">Happy Birthday</div>
          <div className="text-gray-600">1992年1月25日({getAge(birthday)})</div>
<!--           <div className="text-lg text-blue-500">顔写真</div> -->
<!--           <div className="text-lg text-blue-500">過去経歴</div> -->
          <div className="text-lg text-blue-500">Skillset</div>
          <div className="text-gray-600">HTML, JavaScript, CSS, React.js, Next.js, Tailwind.css</div>
          <div className="text-lg text-blue-500">Qualification & Tools</div>
          <div className="text-gray-600">ITパスポート, GitHub, VSCode</div>
<!--           <div className="text-lg text-blue-500">自身の強みと具体的なエピソード（自己PR）</div> -->
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

import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useAge } from '@hooks/useAge';
import { ProfListBox } from '@comp/box/profListBox';
import { TitleBox } from '@comp/title/TitleBox';

const Home: NextPage = () => {
  const [age] = useAge(1992, 1, 25);
  return (
    <div className="h-full w-full font-n2i flex justify-center items-center">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>

      <div className="w-full max-h-full text-gray-900 grid lg:grid-cols-2 justify-center items-start lg:items-start">
        <div className="w-full h-auto">
          <Image
            src="/img/084AME0226.jpg.webp"
            alt="image"
            className="image w-full h-full"
            fill
          />
        </div>
        <div className="w-full flex flex-col pl-0 pt-2 pb-8 lg:pl-8 lg:pt-0 tracking-wider">
          <TitleBox
            title="ABOUT"
            color="blue"
            subTitle="私について"
            size="big"
          />
          <ProfListBox
            profList={[
              { title: 'Name', description: 'Yuichi Sakagami' },
              { title: 'Birthday', description: `1992年1月25日 ( ${age}歳 )` },
              {
                title: 'Skillset',
                description:
                  'HTML, JavaScript, CSS, React.js, Next.js, Tailwind.css, Python, PHP, VBA, GAS',
              },
              {
                title: 'Qualification & Tools',
                description:
                  'ITパスポート, VBA Expert Standard(Excel), GitHub, VSCode',
              },
            ]}
            className="pl-4 sm:pl-12"
          />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default Home;

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
    <div className="w-full px-10 font-n2i">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>

      <div className="w-full text-gray-900 mt-4 pt-2 grid sm:grid-cols-2">
        <div className="w-full">
          <Image
            src="/img/084AME0226.jpg.webp"
            alt="image"
            width={941}
            height={627}
            className="w-full"
          />
        </div>
        <div className="w-full flex flex-col pl-0 pt-2 pb-8 sm:pl-8 sm:pt-0 tracking-wider">
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
            className="pl-12"
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

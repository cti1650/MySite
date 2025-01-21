import React, { FC } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useAge } from '@hooks/useAge';
import { ProfListBox } from '@comp/box/profListBox';
import { TitleBox } from '@comp/title/TitleBox';
import HeroImageUrl from '@img/084AME0226.jpg.webp';
import DifyChatbot from '@comp/tool/DifyChatbot';
import { useBizPath } from '@comp/context';

export const TopPage: FC = () => {
  const [age] = useAge(1992, 1, 25);
  const path = useBizPath();

  return (
    <div className="h-full w-full font-n2i flex justify-center items-center">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
        <meta
          property="og:url"
          content={path}
        />
      </Head>

      <div className="w-full max-h-full text-gray-900 grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start lg:items-start">
        <div className="w-full min-w-full h-auto">
          <span>
            <Image
              // src="/img/084AME0226.jpg.webp"
              src={HeroImageUrl}
              alt="image"
              className="image w-full min-w-full h-full"
              fill
            />
          </span>
        </div>
        <div className="w-full flex flex-col pb-8 tracking-wider">
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
                  'HTML, JavaScript, CSS, React.js, Next.js, Tailwind.css, React Native, Expo, Python, PHP, VBA, GAS, Chrome拡張機能開発',
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
      <DifyChatbot />
    </div>
  );
};
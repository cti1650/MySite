import { ProfListBox } from '@comp/box/profListBox';
import { TitleBox } from '@comp/title/TitleBox';
import DifyChatbot from '@comp/tool/DifyChatbot';
import { useAge } from '@hooks/useAge';
import HeroImageUrl from '@img/084AME0226.jpg.webp';
import { profile, qualifications, skillset, toDisplayList } from '@lib/profile';
import Head from 'next/head';
import Image from 'next/image';
import type { FC } from 'react';

export const TopPage: FC = () => {
  const { year, month, date } = profile.birthday;
  const [age] = useAge(year, month, date);

  return (
    <div className="h-full w-full font-n2i flex justify-center items-center">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>

      <div className="w-full max-h-full text-gray-900 grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center items-start lg:items-start">
        <div className="w-full min-w-full h-auto">
          <Image src={HeroImageUrl} alt="image" className="w-full h-auto" />
        </div>
        <div className="w-full flex flex-col pb-8 tracking-wider">
          <TitleBox
            title="ABOUT"
            color="blue"
            subTitle="私について"
            size="big"
          />
          <div className="pl-4 sm:pl-12 pb-2">
            {/* 日本語が語中で折れないよう文節単位で改行する(非対応ブラウザは既定動作) */}
            <p className="text-lg text-gray-800 leading-relaxed [word-break:auto-phrase]">
              {profile.headline}
            </p>
            <p className="pt-2 text-sm text-gray-600 leading-relaxed [word-break:auto-phrase]">
              {profile.description}
            </p>
          </div>
          <ProfListBox
            profList={[
              { title: 'Name', description: profile.name },
              {
                title: 'Birthday',
                description: `${year}年${month}月${date}日 ( ${age}歳 )`,
              },
              { title: 'Skillset', description: toDisplayList(skillset) },
              {
                title: 'Qualification & Tools',
                description: toDisplayList(qualifications),
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

import { GithubButton, PageLinkButton } from '@comp/button/Buttons';
import { useViewLayerPath } from '@comp/context';
import type { ResponseData } from '@lib/portfolioApi';
import cc from 'classcat';
import Head from 'next/head';
import Image from 'next/image';
import type { FC } from 'react';

const getTagColorStyle: Record<string, string> = {
  'light gray': 'bg-gray-50',
  gray: 'bg-gray-700 bg-opacity-25',
  brown: 'bg-yellow-900 bg-opacity-25',
  orange: 'bg-yellow-600 bg-opacity-25',
  yellow: 'bg-yellow-400 bg-opacity-25',
  green: 'bg-green-700 bg-opacity-25',
  blue: 'bg-blue-700 bg-opacity-25',
  purple: 'bg-pink-800 bg-opacity-25',
  pink: 'bg-pink-300 bg-opacity-25',
  red: 'bg-red-600 bg-opacity-25',
};

type Props = {
  portfolios: ResponseData;
};

export const SitePage: FC<Props> = ({ portfolios }) => {
  const path = useViewLayerPath();
  return (
    <div className="w-full px-1 lg:px-10 font-n2i md:max-w-5xl mx-auto">
      <Head>
        <title>cti1650 Portfolios</title>
        <meta property="og:title" content="cti1650 Portfolios" />
        <meta property="og:site_name" content="cti1650 Portfolios" />
        <meta
          name="description"
          content="cti1650が個人開発したポートフォリオです。"
        />
        <meta
          property="og:description"
          content="cti1650が個人開発したポートフォリオです。"
        />
        <meta property="og:url" content={path} />
      </Head>

      <div className="w-full text-gray-900 lg:py-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center content-center justify-center">
          {portfolios?.map((item) => {
            return (
              <div
                key={item?.name}
                className="px-4 py-8 w-full flex flex-col space-y-6"
              >
                <h2 className="w-full text-2xl tracking-wider text-center text-blue-500 whitespace-pre-wrap">
                  <div>{item?.name}</div>
                </h2>
                {item?.github && <GithubButton href={item?.github} />}
                {item?.img && (
                  <div className="relative w-full h-80">
                    <Image
                      src={item?.img}
                      alt={`${item?.name ?? 'Item'} Image`}
                      className="object-contain"
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="w-full tracking-wider text-left whitespace-pre-wrap">
                  {item?.description}
                </div>
                <PageLinkButton href={item?.link} ariaLabel={item?.name}>
                  サイトを開く
                </PageLinkButton>
                {item?.rawTags && (
                  <div className="w-full flex flex-row flex-wrap">
                    {item?.rawTags?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={cc([
                            'border border-gray-300 rounded py-0.5 px-1 m-0.5 text-xs text-gray-600',
                            getTagColorStyle[item?.color],
                          ])}
                        >
                          {item?.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

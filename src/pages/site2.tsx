import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PageLinkButton, GithubButton } from '@comp/button/Buttons';
import { usePortfoliosData } from '@hooks/usePortfoliosData';
import { NotionDatabaseClient, twNotionTagColor } from '@hooks/useNotion2';
import cc from 'classcat';

type PortfoliosType = {
  name: string;
  description: string;
  github: string;
  img: string;
  link: string;
  type: string;
  tags?: {
    id: string;
    name: string;
    color: string;
  }[];
}[];

const Site: NextPage = (props: any) => {
  const { database } = props;
  const [data] = usePortfoliosData();
  const portfolios: PortfoliosType = database || data;
  console.log(database);
  return (
    <div className="w-full px-1 lg:px-10 font-n2i md:max-w-5xl mx-auto">
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property="og:title" content="cti1650 Portfolio" />
      </Head>

      <div className="w-full text-gray-900 py-8">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center content-center justify-center">
          {portfolios &&
            portfolios.map((item) => {
              return (
                <div
                  key={item.name}
                  className="px-4 py-8 w-full flex flex-col space-y-6"
                >
                  <h2 className="w-full text-2xl tracking-wider text-center text-blue-500 whitespace-pre-wrap">
                    <div>{item.name}</div>
                  </h2>
                  {item.github && <GithubButton href={item.github} />}
                  {item.img.length > 0 && (
                    <div className="w-full content-center ">
                      <img
                        src={item.img[0]}
                        alt="image"
                        className="mx-auto max-h-80"
                      />
                    </div>
                  )}
                  <div className="w-full tracking-wider text-left whitespace-pre-wrap">
                    {item.description}
                  </div>
                  <PageLinkButton href={item.link}>サイトを開く</PageLinkButton>
                  {item.tags && (
                    <div className="w-full flex flex-row flex-wrap">
                      {item.tags.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className={cc([
                              'border border-gray-300 rounded py-0.5 px-1 m-0.5 text-xs text-gray-600',
                              twNotionTagColor[item.color],
                            ])}
                          >
                            {item.name}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { properties, propertyValues } = await NotionDatabaseClient({
    database_id: 'fc568e3d9abc4834b7e8934795e1dbbf',
    filter: {
      and: [
        {
          property: 'type',
          select: {
            equals: '公開中',
          },
        },
      ],
    },
  });
  return {
    props: {
      database: propertyValues,
    },
  };
};

export default Site;

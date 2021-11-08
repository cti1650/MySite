import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PageLinkButton, GithubButton } from '@comp/button/Buttons';
import { usePortfoliosData } from '@hooks/usePortfoliosData';
import { useNotionClient } from '@hooks/useNotion';
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

const getTagColorStyle = {
  'light gray': 'bg-gray-50',
  'gray': 'bg-gray-700 bg-opacity-25',
  'brown': 'bg-yellow-900 bg-opacity-25',
  'orange': 'bg-yellow-600 bg-opacity-25',
  'yellow': 'bg-yellow-400 bg-opacity-25',
  'green': 'bg-green-700 bg-opacity-25',
  'blue': 'bg-blue-700 bg-opacity-25',
  'purple': 'bg-pink-800 bg-opacity-25',
  'pink': 'bg-pink-300 bg-opacity-25',
  'red': 'bg-red-600 bg-opacity-25'
};

const Site: NextPage = (props: any) => {
  const { tabledata } = props;
  const [data] = usePortfoliosData();
  const portfolios: PortfoliosType = tabledata || data;

  return (
    <div className='w-full px-10 font-n2i md:max-w-5xl mx-auto'>
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property='og:title' content='cti1650 Portfolio' />
      </Head>

      <div className='w-full text-gray-900 py-8'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-3 text-center content-center justify-center'>
          {portfolios &&
            portfolios.map((item) => {
              return (
                <div
                  key={item.name}
                  className='px-4 py-8 w-full flex flex-col space-y-6'
                >
                  <h2 className='w-full text-2xl tracking-wider text-center text-blue-500 whitespace-pre-wrap'>
                    <div>{item.name}</div>
                  </h2>
                  {item.github && <GithubButton href={item.github} />}
                  {item.img && (
                    <div className='w-full content-center '>
                      <img
                        src={item.img}
                        alt='image'
                        className='mx-auto max-h-80'
                      />
                    </div>
                  )}
                  <div className='w-full tracking-wider text-left whitespace-pre-wrap'>
                    {item.description}
                  </div>
                  <PageLinkButton href={item.link}>サイトを開く</PageLinkButton>
                  {item.tags && (
                    <div className='w-full flex flex-row flex-wrap'>
                      {item.tags.map((item) => {
                        console.log(getTagColorStyle[item.color])
                        return (
                          <div
                            key={item.id}
                            className={cc([
                              'border border-gray-300 rounded py-0.5 px-1 m-0.5 text-xs text-gray-600',
                              getTagColorStyle[item.color],
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
  const { getTable } = useNotionClient('', 'fc568e3d9abc4834b7e8934795e1dbbf');
  const data = [...(await getTable())]
    .map((item) => {
      const propList: any = item['properties'];
      return {
        name: propList.Name.title[0]?.text.content || '',
        description: propList.description.rich_text[0]?.text.content || '',
        github: propList.github.url || '',
        img: propList.img.files[0]?.name || '',
        link: propList.link.url || '',
        type: propList.type.select?.name || '',
        tags: propList.tags.multi_select! || [],
      };
    })
    .filter((item) => {
      return item.type === '公開中';
    });
  return {
    props: {
      tabledata: data,
    },
  };
};

export default Site;

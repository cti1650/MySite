import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { PageLinkButton, GithubButton } from '@comp/button/Buttons';

import useSWR from 'swr'

const fetcher = () => fetch('/api/portfolios').then((res) => res.json())

const Home = () => {
  const { data, error } = useSWR('/api/portfolios', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <div className='w-full px-10 font-n2i md:max-w-5xl mx-auto'>
      <Head>
        <title>cti1650 Portfolio</title>
        <meta property='og:title' content='MySite' />
      </Head>

      <div className='w-full text-gray-900 py-8'>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 text-center content-center justify-center">
          {data && data.map(item => {
            return (<>
              <div key={item.name} className="px-4 py-8 w-full flex flex-col space-y-6">
                <h2 className="w-full text-2xl tracking-wider text-center text-blue-500 whitespace-pre-wrap"><div>{item.name}</div></h2>
                {item.github && <GithubButton href={item.github} />}
                <div className="w-full content-center "><img src={item.img} alt="image" className="mx-auto max-h-80" /></div>
                <div className="w-full tracking-wider text-center whitespace-pre-wrap">{item.description}</div>
                <PageLinkButton href={item.link}>サイトを開く</PageLinkButton>
              </div>
            </>)
          })
          }
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  return {
    props: {},
  };
}

export default Home;

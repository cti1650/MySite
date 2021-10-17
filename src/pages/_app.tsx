import 'tailwindcss/tailwind.css';

import React from 'react';
import App, { AppProps } from 'next/app';
import Layout from '@comp/layout/layoutSub';
import Head from 'next/head';
import { usePageView } from '@hooks/usePageView';

const TailwindApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  usePageView();
  return (
    <Layout>
      <Head>
        <title>MySite</title>
        <link rel='icon' href='/icon/tailwind_cc-128x128.ico' />
        <meta name='viewport' content='user-scalable=no' />
        <meta name="robots" content="noindex" />
        <meta name="robots" content="nofollow" />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1.0,minimum-scale=1.0'
        ></meta>
        <meta
          name='description'
          content='ポートフォリオサイトです。'
        />
        <meta name='keywords' content='HTML,CSS,Tailwind.css'></meta>
        <meta property='og:title' content='MySite' />
        <meta
          property='og:description'
          content='ポートフォリオサイトです。'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://tailwind-cc.vercel.app/' />
        <meta property='og:image' content='img/logo_icon_white.png' />
        <meta property='og:site_name' content='MySite' />
        <meta property='og:locale' content='ja_JP' />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
};

export default TailwindApp;

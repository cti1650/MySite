/* eslint-disable no-undef */
import 'styles/mantineBase.css';
import 'tailwindcss/tailwind.css';
import './nextImage.css';

import React from 'react';
import { AppProps } from 'next/app';
import { Layout } from '@comp/layout/layoutSub';
import Head from 'next/head';
import { usePageView } from '@hooks/usePageView';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { BizProvider } from '@comp/context';

const TailwindApp = ({ Component, pageProps }: AppProps) => {
  usePageView();
  return (
    <>
      <Head>
        <title>cti1650 Portfolio</title>
        <link rel="icon" href="img/logo_icon_white.png" />
        <meta name="viewport" content="user-scalable=no" />
        {/* <meta name="robots" content="noindex" />
        <meta name="robots" content="nofollow" /> */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0"
        ></meta>
        <meta
          name="description"
          content="cti1650のポートフォリオサイトです。"
        />
        <meta
          name="keywords"
          content="Next.js,React,TypeScript,Tailwind,Expo,React Native,Python,GAS,VBA,Chrome Extension"
        ></meta>
        <meta property="og:title" content="cti1650 Portfolio" />
        <meta
          property="og:description"
          content="cti1650のポートフォリオサイトです。"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://cti1650-portfolio-site.vercel.app/img/ogp.png"
        />
        <meta property="og:site_name" content="cti1650 Portfolio" />
        <meta property="og:locale" content="ja_JP" />
      </Head>
      <MantineProvider>
        <NotificationsProvider>
          <BizProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </BizProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
};

export default TailwindApp;

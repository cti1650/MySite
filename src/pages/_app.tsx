/* eslint-disable no-undef */
import 'tailwindcss/tailwind.css';

import React from 'react';
import { AppProps } from 'next/app';
import { Layout } from '@comp/layout/layoutSub';
import Head from 'next/head';
import { usePageView } from '@hooks/usePageView';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';

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
        <meta name="keywords" content="HTML,CSS,Tailwind.css"></meta>
        <meta property="og:title" content="cti1650 Portfolio" />
        <meta
          property="og:description"
          content="cti1650のポートフォリオサイトです。"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://cti1650-portfolio-site.vercel.app/"
        />
        <meta property="og:image" content="img/logo_icon_white.png" />
        <meta property="og:site_name" content="cti1650 Portfolio" />
        <meta property="og:locale" content="ja_JP" />
      </Head>
      <MantineProvider>
        <NotificationsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
};

export default TailwindApp;

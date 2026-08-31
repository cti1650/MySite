import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'styles/mantineBase.css';
import 'tailwindcss/tailwind.css';

import { ViewLayerProvider } from '@comp/context';
import { Layout } from '@comp/layout/layoutSub';
import { usePageView } from '@hooks/usePageView';
import type { SiteMetaProps } from '@lib/pageProps';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const theme = createTheme({});

const TailwindApp = ({ Component, pageProps }: AppProps) => {
  usePageView();
  // getServerSideProps を持たないページ（404等）では undefined になる
  const { origin, pageUrl } = pageProps as Partial<SiteMetaProps>;
  const ogImageOrigin = origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? '';
  return (
    <>
      <Head>
        <title>cti1650 Portfolio</title>
        <link rel="icon" href="img/logo_icon_white.png" />
        <link
          rel="alternate"
          type="text/plain"
          title="llms.txt"
          href="/llms.txt"
        />
        <link
          rel="alternate"
          type="text/plain"
          title="llms-full.txt"
          href="/llms-full.txt"
        />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap.xml"
        />
        {/* <meta name="robots" content="noindex" />
        <meta name="robots" content="nofollow" /> */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,minimum-scale=1.0"
        />
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
        {/* 各ドメインを独立したサイトとして扱うため、og:url も canonical も
            アクセス先ドメインを指す。 */}
        {pageUrl && (
          <>
            <meta property="og:url" content={pageUrl} />
            <link rel="canonical" href={pageUrl} />
          </>
        )}
        <meta property="og:image" content={`${ogImageOrigin}/img/ogp.png`} />
        <meta property="og:site_name" content="cti1650 Portfolio" />
        <meta property="og:locale" content="ja_JP" />
      </Head>
      <MantineProvider theme={theme}>
        <Notifications />
        <ViewLayerProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ViewLayerProvider>
      </MantineProvider>
    </>
  );
};

export default TailwindApp;

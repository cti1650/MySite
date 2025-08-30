import { GetServerSideProps, NextPage } from 'next';

type Props = {};

const ShortcutRedirect: NextPage<Props> = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortcut_name } = context.params as { shortcut_name: string };

  const redirectMap: Record<string, string> = {
    playground: 'https://paiza.io/ja/projects/new',
    space: 'https://app.rc.ovice.com/ws/p4ofxd8oeo/',
    chrome_extension_install:
      'https://scrapbox.io/cti-scrap/Chrome%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%81%AE%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95',
    chrome_extension: 'https://chromewebstore.google.com/search/cti-tl',
  };

  if (!redirectMap[shortcut_name]) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: redirectMap[shortcut_name],
      permanent: false,
    },
  };
};

export default ShortcutRedirect;

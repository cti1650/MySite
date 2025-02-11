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

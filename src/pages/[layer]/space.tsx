import { viewLayerList } from '@comp/context';

export async function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://app.rc.ovice.com/ws/p4ofxd8oeo/',
      permanent: false,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: viewLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default function Home() {
  return null;
}

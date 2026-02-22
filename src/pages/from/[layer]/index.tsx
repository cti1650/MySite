import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
import { TopPage } from '@comp/page/top';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerHome: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <TopPage />
    </ViewLayerPageContainer>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: viewSocialLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default ViewLayerHome;

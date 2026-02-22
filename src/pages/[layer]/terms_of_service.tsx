import { ViewLayerPageContainer, viewLayerList } from '@comp/context';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

const ViewLayerTermsOfService: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <TermsOfServicePage />
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
    paths: viewLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default ViewLayerTermsOfService;

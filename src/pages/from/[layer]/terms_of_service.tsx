import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { TermsOfServicePage } from '@comp/page/termsOfServicePage';
import { ViewLayerPageContainer, viewSocialLayerList } from '@comp/context';
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
    paths: viewSocialLayerList.map((layer) => ({ params: { layer } })),
    fallback: false, // 指定パス以外なら404を返す
  };
}

export default ViewLayerTermsOfService;

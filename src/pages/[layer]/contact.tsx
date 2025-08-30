import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { ContactPage } from '@comp/page/contact';
import { viewLayerList, ViewLayerPageContainer } from '@comp/context';
import { useRouter } from 'next/router';

const ViewLayerContact: NextPage = () => {
  const router = useRouter();
  return (
    <ViewLayerPageContainer targetLayer={router.query.layer as string}>
      <ContactPage />
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

export default ViewLayerContact;

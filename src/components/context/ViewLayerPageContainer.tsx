import Head from 'next/head';
import type { ReactNode } from 'react';
import { useViewLayerPage } from './hooks';

export const ViewLayerPageContainer = ({
  children,
  targetLayer,
}: {
  children: ReactNode;
  targetLayer: string;
}) => {
  useViewLayerPage({ targetLayer });
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {children}
    </>
  );
};

export const BizPageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <ViewLayerPageContainer targetLayer="biz">
      {children}
    </ViewLayerPageContainer>
  );
};

export const LibePageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <ViewLayerPageContainer targetLayer="libe">
      {children}
    </ViewLayerPageContainer>
  );
};

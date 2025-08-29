import Head from 'next/head';
import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';

export const ViewLayerContext = createContext([
  'private',
  (layer: string) => {},
] as [string, (layer: string) => void]);

export const ViewLayerProvider = ({ children }) => {
  const [layer, setLayer] = React.useState('private');
  return (
    <ViewLayerContext.Provider value={[layer, setLayer]}>
      {children}
    </ViewLayerContext.Provider>
  );
};

export const useViewLayer = () => {
  return useContext(ViewLayerContext);
};

export const useBizPage = () => {
  const [, setLayer] = useViewLayer();

  useEffect(() => {
    setLayer('biz');
  }, [setLayer]);
};

export const useLibePage = () => {
  const [, setLayer] = useViewLayer();

  useEffect(() => {
    setLayer('libe');
  }, [setLayer]);
};

export const useViewLayerRootPath = () => {
  const [layer] = useViewLayer();
  switch (layer) {
    case 'biz':
      return '/biz';
    case 'libe':
      return '/libe';
    default:
      return '';
  }
};

export const useViewLayerPath = () => {
  return 'https://cti1650-portfolio-site.vercel.app' + useViewLayerRootPath();
};

export const useBizPath = () => {
  const [isBiz] = useViewLayer();
  return 'https://cti1650-portfolio-site.vercel.app/' + (isBiz ? 'biz/' : '');
};

export const BizPageContainer = ({ children }) => {
  useBizPage();
  return <>{children}</>;
};

export const LibePageContainer = ({ children }) => {
  useLibePage();
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {children}
    </>
  );
};

export const BizContent = ({ children }) => {
  const [layer] = useViewLayer();
  return <>{layer === 'biz' && children}</>;
};

export const PrivateContent = ({ children }) => {
  const [layer] = useViewLayer();
  return <>{layer === 'private' && children}</>;
};

export const LibeContent = ({ children }) => {
  const [layer] = useViewLayer();
  return <>{layer === 'libe' && children}</>;
};

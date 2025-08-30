import Head from 'next/head';
import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';

export const DEFAULT_VIEW_LAYER = 'private';

type ViewLayerContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

export const viewLayerList = ['private', 'biz', 'libe'];

export const ViewLayerContext = createContext([
  DEFAULT_VIEW_LAYER,
  () => {},
] as ViewLayerContextType);

export const ViewLayerProvider = ({ children }) => {
  const [layer, setLayer] = React.useState(DEFAULT_VIEW_LAYER);
  return (
    <ViewLayerContext.Provider value={[layer, setLayer]}>
      {children}
    </ViewLayerContext.Provider>
  );
};

export const useViewLayer = () => {
  return useContext(ViewLayerContext);
};

export const useViewLayerPage = ({ targetLayer = DEFAULT_VIEW_LAYER }) => {
  const [, setLayer] = useViewLayer();

  useEffect(() => {
    setLayer(targetLayer);
  }, [setLayer, targetLayer]);
};

export const useBizPage = () => {
  useViewLayerPage({ targetLayer: 'biz' });
};

export const useLibePage = () => {
  useViewLayerPage({ targetLayer: 'libe' });
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

export const ViewLayerPageContainer = ({ children, targetLayer }) => {
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

export const BizPageContainer = ({ children }) => {
  return (
    <ViewLayerPageContainer targetLayer="biz">
      {children}
    </ViewLayerPageContainer>
  );
};

export const LibePageContainer = ({ children }) => {
  return (
    <ViewLayerPageContainer targetLayer="libe">
      {children}
    </ViewLayerPageContainer>
  );
};

export const ContentFilter = ({ children, targetLayer }) => {
  const [layer] = useViewLayer();
  if (targetLayer === 'default') return <>{children}</>;

  return <>{layer === targetLayer && children}</>;
};

export const BizContent = ({ children }) => {
  return <ContentFilter targetLayer="biz">{children}</ContentFilter>;
};

export const PrivateContent = ({ children }) => {
  return <ContentFilter targetLayer="private">{children}</ContentFilter>;
};

export const LibeContent = ({ children }) => {
  return <ContentFilter targetLayer="libe">{children}</ContentFilter>;
};

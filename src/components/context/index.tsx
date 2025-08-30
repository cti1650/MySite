import Head from 'next/head';
import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';

export const DEFAULT_VIEW_LAYER = 'private';

type ViewLayerContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

export const viewLayerSettings = [
  {
    layer: 'private',
  },
  {
    layer: 'biz',
    path: '/biz',
  },
  {
    layer: 'libe',
    path: '/from/libe',
    parentLayer: 'private',
  },
  {
    layer: 'test',
    path: '/from/test',
    parentLayer: 'libe',
  },
  {
    layer: 'facebook',
    path: '/from/facebook',
    parentLayer: 'biz',
  },
  {
    layer: 'linkedin',
    path: '/from/linkedin',
    parentLayer: 'biz',
  },
  {
    layer: 'findy',
    path: '/from/findy',
    parentLayer: 'biz',
  },
  {
    layer: 'wantedly',
    path: '/from/wantedly',
    parentLayer: 'biz',
  },
  {
    layer: 'x',
    path: '/from/x',
    parentLayer: 'private',
  },
];

export const getViewLayerSetting = (layer: string) => {
  return viewLayerSettings.find((setting) => setting.layer === layer);
};

export const getViewLayerParentSetting = (layer: string) => {
  const parent = viewLayerSettings.find(
    (setting) => setting.layer === layer
  )?.parentLayer;
  return getViewLayerSetting(parent);
};

export const viewLayerList = viewLayerSettings
  .filter((setting) => setting.layer && !setting.parentLayer)
  .map((setting) => setting.layer as string);
export const viewSocialLayerList = viewLayerSettings
  .filter((setting) => setting.layer && setting.parentLayer)
  .map((setting) => setting.layer as string);

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
  const path = getViewLayerSetting(layer)?.path || '';

  return path;
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

type ContentFilterProps = {
  children: React.ReactNode;
  targetLayer?: string;
  targetLayers?: string[];
};

export const ContentFilter = ({
  children,
  targetLayer,
  targetLayers = [],
}: ContentFilterProps) => {
  const [layer] = useViewLayer();
  const parentLayers = [];
  let parentLayer = getViewLayerParentSetting(layer)?.layer;
  do {
    if (parentLayer) parentLayers.push(parentLayer);
    parentLayer = getViewLayerParentSetting(parentLayer)?.layer;
  } while (parentLayer);
  const checkLayers = [...parentLayers, layer];
  const isDefaultLayer =
    targetLayer === 'default' ||
    (targetLayers.length === 1 && targetLayers[0] === 'default');
  if (isDefaultLayer) {
    return <>{children}</>;
  }
  const isValid = checkLayers.some((checkLayer) => {
    if (targetLayers.length > 0 && !targetLayers.includes(checkLayer))
      return null;
    const hasTargetLayers =
      targetLayers.length > 0 && targetLayers.includes(checkLayer);
    const isTargetLayer = checkLayer === targetLayer;
    if (![hasTargetLayers, isTargetLayer].some(Boolean)) return null;

    return checkLayer;
  });
  if (!isValid) return null;

  return <>{children}</>;
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

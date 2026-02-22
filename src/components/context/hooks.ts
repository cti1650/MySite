import { useContext, useEffect } from 'react';
import { DEFAULT_VIEW_LAYER, getViewLayerSetting } from './config';
import { ViewLayerContext } from './ViewLayerProvider';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

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
  return `${SITE_URL}${useViewLayerRootPath()}`;
};

export const useBizPath = () => {
  const [isBiz] = useViewLayer();
  return `${SITE_URL}/${isBiz ? 'biz/' : ''}`;
};

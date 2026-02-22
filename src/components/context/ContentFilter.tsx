import type { ReactNode } from 'react';
import { getViewLayerParentSetting } from './config';
import { useViewLayer } from './hooks';

type ContentFilterProps = {
  children: ReactNode;
  targetLayer?: string;
  targetLayers?: string[];
};

export const ContentFilter = ({
  children,
  targetLayer,
  targetLayers = [],
}: ContentFilterProps) => {
  const [layer] = useViewLayer();
  const parentLayers: string[] = [];
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

export const BizContent = ({ children }: { children: ReactNode }) => {
  return <ContentFilter targetLayer="biz">{children}</ContentFilter>;
};

export const PrivateContent = ({ children }: { children: ReactNode }) => {
  return <ContentFilter targetLayer="private">{children}</ContentFilter>;
};

export const LibeContent = ({ children }: { children: ReactNode }) => {
  return <ContentFilter targetLayer="libe">{children}</ContentFilter>;
};

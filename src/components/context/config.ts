export const DEFAULT_VIEW_LAYER = 'private';

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
  {
    layer: 'qiita',
    path: '/from/qiita',
    parentLayer: 'private',
  },
  {
    layer: 'zenn',
    path: '/from/zenn',
    parentLayer: 'private',
  },
  {
    layer: 'extension',
    path: '/from/extension',
    parentLayer: 'private',
  },
];

export const getViewLayerSetting = (layer: string) => {
  return viewLayerSettings.find((setting) => setting.layer === layer);
};

export const getViewLayerParentSetting = (layer: string | undefined) => {
  if (!layer) return undefined;
  const parent = viewLayerSettings.find(
    (setting) => setting.layer === layer,
  )?.parentLayer;
  if (!parent) return undefined;
  return getViewLayerSetting(parent);
};

export const viewLayerList = viewLayerSettings
  .filter((setting) => setting.layer && !setting.parentLayer)
  .map((setting) => setting.layer as string);
export const viewSocialLayerList = viewLayerSettings
  .filter((setting) => setting.layer && setting.parentLayer)
  .map((setting) => setting.layer as string);

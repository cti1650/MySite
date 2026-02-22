import React, { createContext } from 'react';
import { DEFAULT_VIEW_LAYER } from './config';

type ViewLayerContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>,
];

export const ViewLayerContext = createContext([
  DEFAULT_VIEW_LAYER,
  () => {},
] as ViewLayerContextType);

export const ViewLayerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [layer, setLayer] = React.useState(DEFAULT_VIEW_LAYER);
  return (
    <ViewLayerContext.Provider value={[layer, setLayer]}>
      {children}
    </ViewLayerContext.Provider>
  );
};

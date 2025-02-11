import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';

export const BizContext = createContext(undefined);

export const BizProvider = ({ children }) => {
  const [biz, setBiz] = React.useState(false);
  return (
    <BizContext.Provider value={[biz, setBiz]}>{children}</BizContext.Provider>
  );
};

export const useBiz = () => {
  return useContext(BizContext);
};

export const useBizPage = () => {
  const [, setBiz] = useBiz();

  useEffect(() => {
    setBiz(true);
  }, [setBiz]);
};

export const useBizPath = () => {
  const [isBiz] = useBiz();
  return 'https://cti1650-portfolio-site.vercel.app/' + (isBiz ? 'biz/' : '');
};

export const BizContent = ({ children }) => {
  const [biz] = useBiz();
  return <>{biz && children}</>;
};

export const PrivateContent = ({ children }) => {
  const [biz] = useBiz();
  return <>{!biz && children}</>;
};

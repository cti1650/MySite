import { Loader } from '@mantine/core';
import React, { useMemo, VFC } from 'react';

export const FormLoading: VFC = () => {
  return useMemo(() => <div className="w-full flex justify-center items-center">
    <Loader size="lg" color="gray" variant="dots" />
  </div>,
    []);
};
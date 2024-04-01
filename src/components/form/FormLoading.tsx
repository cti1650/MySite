import { Loader } from '@mantine/core';
import React, { useMemo, FC } from 'react';

export const FormLoading: FC = () => {
  return useMemo(
    () => (
      <div className="h-auto min-h-full w-full max-w-[400px] mx-auto flex justify-center items-center">
        <Loader size="lg" color="gray" variant="dots" />
      </div>
    ),
    []
  );
};

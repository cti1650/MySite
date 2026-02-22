import { Loader } from '@mantine/core';
import { type FC, useMemo } from 'react';

export const FormLoading: FC = () => {
  return useMemo(
    () => (
      <div className="h-auto min-h-full w-full max-w-[400px] mx-auto flex justify-center items-center">
        <Loader size="lg" color="gray" type="dots" />
      </div>
    ),
    [],
  );
};

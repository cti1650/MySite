import React, { ReactElement } from 'react';
import cc from 'classcat';

type VerticalBarPropsType = {
  children?: ReactElement;
  position?: 'right' | 'left';
  autoHidden?: boolean;
  className?: string;
};

export const VerticalBar = ({
  children,
  position,
  autoHidden,
  className,
}: VerticalBarPropsType) => {
  return (
    <>
      <div
        className={cc([
          'fixed top-0 ',
          {
            'right-0': position === 'right' && !autoHidden,
            'left-0': position === 'left' && !autoHidden,
            '-right-10 sm:right-0': position === 'right' && autoHidden,
            '-left-10 sm:left-0': position === 'left' && autoHidden,
          },
          'w-10 h-full bg-white z-20',
          className,
        ])}
      >
        <div className="relative top-1/2 right-0 transform rotate-90 items-center">
          {children}
        </div>
      </div>
    </>
  );
};

VerticalBar.defaultProps = {
  position: 'left',
  autoHidden: false,
};

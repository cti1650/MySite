import React, { ReactElement } from "react";
import cc from "classcat";

type VerticalBarPropsType = {
  children?: ReactElement,
  position?: "right" | "left",
  className?: string,
}

export const VerticalBar = ({ children, position, className }: VerticalBarPropsType) => {
  return (
    <>
      <div className={cc(["fixed top-0 ", { "right-0": position === 'right', "left-0": position === 'left' }, "w-10 h-full bg-white z-20", className])}>
        <div className='relative top-1/2 right-0 transform rotate-90 items-center'>
          {children}
        </div>
      </div>
    </>
  );
}

VerticalBar.defaultProps = {
  position: 'left',
}
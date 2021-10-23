import React from "react";
import cc from "classcat";

type VerticalBarPropsType = {
  children?: any,
  position?: "right" | "left",
}

export const VerticalBar = ({ children, position }: VerticalBarPropsType) => {
  return (
    <>
      <div className={cc(["fixed top-0 ", { "right-0": position === 'right', "left-0": position === 'left' }, "w-10 h-full bg-white z-20"])}>
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
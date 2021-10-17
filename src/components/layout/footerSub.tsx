import React from "react";

export default function Footer({ children }) {
  return (
    <>
      <div className="fixed top-0 left-0 w-10 h-full bg-white z-20">
        <div className='fixed top-1/2 transform rotate-90 items-center'>
          <p className="text-xs font-thin tracking-wider text-gray-800">
            ©2021 cti
          </p>
        </div>
      </div>
    </>
  );
}

import React from "react";

export default function Footer({ children }) {
  return (
    <>
      <div className="fixed top-0 left-0 w-10 h-full bg-white z-20">
        <div className='relative top-1/2 right-0 transform rotate-90 items-center'>
          <ol className='h-full w-full flex justify-center items-center content-center space-x-6 text-gray-800'>
            <li className="text-xs font-thin tracking-wider text-gray-800">
              <p className="w-16">©2021 cti</p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

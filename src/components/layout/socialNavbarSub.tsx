import React from "react";

export default function SocialNav({ children }) {
  return (
    <>
      <div className="fixed top-0 right-0 w-10 h-full bg-white z-20">
        <div className='relative top-1/2 right-0 transform rotate-90 items-center'>
          <ol className='h-full w-full py-2 sm:py-4 flex justify-center items-center content-center space-x-6 text-gray-800'>
            <li>
              <a href="https://github.com/cti1650" target="_blank" className="text-xs font-thin tracking-wider text-gray-800">
                GITHUB
              </a>
            </li>
            <li>
              <a href="https://www.wantedly.com/id/yuichi_sakagami" target="_blank" className="text-xs font-thin tracking-wider text-gray-800">
                WANTEDLY
              </a>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

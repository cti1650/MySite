import { SocialButton } from "@comp/button/Buttons";
import React from "react";

export default function SocialNav({ children }) {
  return (
    <>
      <div className="fixed top-0 right-0 w-10 h-full bg-white z-20">
        <div className='relative top-1/2 right-0 transform rotate-90 items-center'>
          <ol className='h-full w-full py-2 sm:py-4 flex justify-center items-center content-center space-x-6 text-gray-800'>
            <li><SocialButton href='https://github.com/cti1650'>GITHUB</SocialButton></li>
            <li><SocialButton href='https://www.wantedly.com/id/yuichi_sakagami'>WANTEDLY</SocialButton></li>
          </ol>
        </div>
      </div>
    </>
  );
}

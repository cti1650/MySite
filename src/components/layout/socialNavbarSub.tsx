import { SocialButton } from "@comp/button/Buttons";
import React from "react";
import { VerticalBar } from '../box/verticalBar'

export default function SocialNav({ children }) {
  return (
    <>
      <VerticalBar position="right">
        <ol className='h-full w-full py-2 sm:py-4 flex justify-center items-center content-center space-x-6 text-gray-800'>
          <li><SocialButton href='https://github.com/cti1650'>GITHUB</SocialButton></li>
          <li><SocialButton href='https://www.wantedly.com/id/yuichi_sakagami'>WANTEDLY</SocialButton></li>
        </ol>
      </VerticalBar>
    </>
  );
}

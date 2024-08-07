import { SocialButton } from '@comp/button/Buttons';
import React, { FC } from 'react';
import { VerticalBar } from '../box/verticalBar';

export const SocialNav: FC = () => {
  return (
    <>
      <VerticalBar position="right">
        <ol className="h-full w-full py-2 lg:py-4 flex justify-center items-center content-center space-x-6 text-gray-800">
          <li>
            <SocialButton href="https://github.com/cti1650">
              GITHUB
            </SocialButton>
          </li>
          <li>
            <SocialButton href="https://www.wantedly.com/id/yuichi_sakagami">
              WANTEDLY
            </SocialButton>
          </li>
          <li>
            <SocialButton href="https://qiita.com/cti1650">QIITA</SocialButton>
          </li>
          <li>
            <SocialButton href="https://zenn.dev/cti1650">ZENN</SocialButton>
          </li>
          <li>
            <SocialButton href="https://coconala.com/users/1713962">
              COCONALA
            </SocialButton>
          </li>
        </ol>
      </VerticalBar>
    </>
  );
};

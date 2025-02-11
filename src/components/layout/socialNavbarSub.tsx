import { SocialButton } from '@comp/button/Buttons';
import React, { FC } from 'react';
import { VerticalBar } from '../box/verticalBar';
import { BizContent, PrivateContent } from '@comp/context';

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
          <BizContent>
            <li>
              <SocialButton href="https://www.wantedly.com/id/yuichi_sakagami">
                WANTEDLY
              </SocialButton>
            </li>
            <li>
              <SocialButton href="https://youtrust.jp/users/04a0cc9719d42b8e3931d2a5111f8f76">
                YOUTRUST
              </SocialButton>
            </li>
            <li>
              <SocialButton href="https://www.linkedin.com/in/yuichi-sakagami-809062306/">
                LINKEDIN
              </SocialButton>
            </li>
          </BizContent>
          <li>
            <SocialButton href="https://qiita.com/cti1650">QIITA</SocialButton>
          </li>
          <li>
            <SocialButton href="https://zenn.dev/cti1650">ZENN</SocialButton>
          </li>
          <PrivateContent>
            <li>
              <SocialButton href="https://coconala.com/users/1713962">
                COCONALA
              </SocialButton>
            </li>
          </PrivateContent>
        </ol>
      </VerticalBar>
    </>
  );
};

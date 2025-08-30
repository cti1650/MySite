import { SocialButton } from '@comp/button/Buttons';
import React, { FC } from 'react';
import { VerticalBar } from '../box/verticalBar';
import {
  BizContent,
  ContentFilter,
  LibeContent,
  PrivateContent,
} from '@comp/context';

const socialButtonContents = [
  {
    href: 'https://github.com/cti1650',
    label: 'GITHUB',
  },
  {
    href: 'https://x.com/cti1650',
    label: 'X',
  },
  {
    href: 'https://www.wantedly.com/id/yuichi_sakagami',
    label: 'WANTEDLY',
    containers: [BizContent],
    targetLayers: ['biz'],
  },
  {
    href: 'https://youtrust.jp/users/04a0cc9719d42b8e3931d2a5111f8f76',
    label: 'YOUTRUST',
    containers: [BizContent],
    targetLayers: ['biz'],
  },
  {
    href: 'https://www.linkedin.com/in/yuichi-sakagami-809062306/',
    label: 'LINKEDIN',
    containers: [BizContent],
    targetLayers: ['biz'],
  },
  {
    href: 'https://qiita.com/cti1650',
    label: 'QIITA',
  },
  {
    href: 'https://zenn.dev/cti1650',
    label: 'ZENN',
  },
  {
    href: 'https://coconala.com/users/1713962',
    label: 'COCONALA',
    containers: [PrivateContent, LibeContent],
    targetLayers: ['private'],
  },
  {
    href: 'https://libecity.com/user_profile/o22hM5ejXIPQcm6fm9P7ye7hThb2',
    label: 'LIBE',
    containers: [LibeContent],
    targetLayers: ['libe'],
  },
];

const SocialNavItems = () => {
  return (
    <>
      {socialButtonContents.map((item, index) => {
        const targetLayers = item.targetLayers || ['default'];
        return (
          <React.Fragment key={index}>
            <ContentFilter targetLayers={targetLayers}>
              <li>
                <SocialButton href={item.href}>{item.label}</SocialButton>
              </li>
            </ContentFilter>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const SocialNav: FC = () => {
  return (
    <>
      <VerticalBar position="right">
        <ol className="h-full w-full py-2 lg:py-4 flex justify-center items-center content-center space-x-6 text-gray-800">
          <SocialNavItems />
        </ol>
      </VerticalBar>
    </>
  );
};

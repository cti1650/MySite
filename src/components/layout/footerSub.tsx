import React, { VFC } from 'react';
import { VerticalBar } from '../box/verticalBar';

export const Footer: VFC = () => {
  return (
    <>
      <VerticalBar position="left">
        <ol className="h-full w-full flex justify-center items-center content-center space-x-6 text-gray-800">
          <li className="text-xs font-thin tracking-wider text-gray-800">
            <p className="w-16">©2021 cti</p>
          </li>
        </ol>
      </VerticalBar>
    </>
  );
};
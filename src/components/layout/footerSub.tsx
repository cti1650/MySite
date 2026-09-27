import { profile } from '@lib/profile';
import type { FC } from 'react';
import { VerticalBar } from '../box/verticalBar';

export const Footer: FC = () => {
  return (
    <VerticalBar position="left">
      <ol className="h-full w-full flex justify-center items-center content-center space-x-6 text-gray-800">
        <li className="text-xs font-thin tracking-wider text-gray-800">
          <p className="whitespace-nowrap">© {profile.handle}</p>
        </li>
      </ol>
    </VerticalBar>
  );
};

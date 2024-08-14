import { NavButton } from '@comp/button/Buttons';
import Link from 'next/link';
import React, { FC } from 'react';
import LogoImageUrl from '@img/logo_icon_white.png';
import Image from 'next/image';

export const Navbar: FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-white z-40">
      <div className="h-20 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" aria-label="cti1650 Portfolio" className="flex items-center space-x-1">
              <Image
                src={LogoImageUrl}
                width={24}
                height={24}
                alt="icon"
                title="CTI1650"
              />
              <span className="hidden sm:inline-block text-2xl font-extrabold tracking-widest">
                CTI1650
              </span>
            </Link>
          </div>
          <div className="pl-2 flex-grow overflow-x-auto">
            <nav className="flex justify-start sm:justify-center">
              <ul className="flex space-x-4 sm:space-x-6 px-4 sm:px-0">
                <li>
                  <NavButton href="/" aria-label="cti1650 Portfolio">Home</NavButton>
                </li>
                <li>
                  <NavButton href="/site" aria-label="cti1650 Portfolios">Portfolios</NavButton>
                </li>
                <li>
                  <NavButton href="/content" aria-label="cti1650 Contents">Contents</NavButton>
                </li>
                <li>
                  <NavButton href="/contact" aria-label="cti1650 Contact">Contact</NavButton>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

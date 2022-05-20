/* eslint-disable jsx-a11y/anchor-is-valid */
import { NavButton } from '@comp/button/Buttons';
import Link from 'next/link';
import React, { VFC } from 'react';

export const Navbar: VFC = () => {
  return (
    <>
      <div className="fixed top-0 left-0 px-10 pt-2.5 w-full bg-white z-40">
        <div className="h-20 flex items-center">
          <div className="w-full h-8 flex flex-row">
            <div className="flex-none h-full py-auto text-center text-2xl font-extrabold tracking-widest z-40">
              <Link href="/">
                <a title="cti1650" className="flex flex-row items-center space-x-1">
                  <p>
                    <img
                      src="img/logo_icon_white.png"
                      width="24px"
                      height="24px"
                      alt="icon"
                      title="CTI1650"
                    ></img>
                  </p>
                  <p className="hidden sm:inline-block">CTI1650</p>
                </a>
              </Link>
            </div>
            <ol className="absolute left-0 flex-grow w-full py-2 lg:py-4 flex justify-center items-center content-center space-x-6 text-gray-800">
              <li>
                <NavButton href="/">Home</NavButton>
              </li>
              <li>
                <NavButton href="/site">Portfolios</NavButton>
              </li>
              <li>
                <NavButton href="/contact">Contact</NavButton>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};
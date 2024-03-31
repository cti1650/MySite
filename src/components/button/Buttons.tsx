/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import React, { VFC } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  href: string;
}

type IconButtonProps = {
  href: string;
}

export const SocialButton: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <a
        href={href}
        target="_blank"
        className="text-gray-900 hover:text-opacity-50 transition delay-300 duration-300 ease-in-out rounded text-xs font-thin tracking-wider"
        rel="noreferrer"
      >
        {children}
      </a>
    </>
  );
};

export const NavButton: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <div className="group">
        <Link legacyBehavior href={href}>
          <a className="px-0 py-1 box-border text-gray-900 font-light tracking-wider">
            {children}
          </a>
        </Link>
        <div className="w-full h-0.5 border-b border-black transition delay-100 duration-100 ease-in-out transform scale-x-0 group-hover:scale-x-100"></div>
      </div>
    </>
  );
};

export const NavButton2: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <Link legacyBehavior href={href}>
        <a className="px-0 py-1 box-border text-gray-900 hover:border-b hover:border-black transition delay-100 duration-100 ease-in-out font-light tracking-wider">
          {children}
        </a>
      </Link>
    </>
  );
};

export const PageLinkButton: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <div className="w-full h-14 group relative overflow-hidden border-t border-b border-gray-300">
        <a href={href} target="_blank" rel="noreferrer">
          <div className="absolute top-0 left-0 z-10 w-full py-4 bg-transparent text-gray-800 group-hover:text-white transition delay-100 duration-100 ease-in-out tracking-wider text-center border-l border-r border-white">
            {children}
          </div>
          <div className="absolute top-0 left-0 z-0 w-full h-full bg-black transition delay-100 duration-100 ease-in-out transform translate-x-full group-hover:translate-x-0"></div>
        </a>
      </div>
    </>
  );
};

export const PageLinkButton3: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <div className="w-full h-14 group relative">
        <a href={href} target="_blank" rel="noreferrer">
          <div className="absolute top-0 left-0 z-10 w-full py-4 bg-transparent text-gray-800 group-hover:text-white transition delay-100 duration-100 ease-in-out tracking-wider text-center border-t border-b border-gray-300">
            {children}
          </div>
          <div className="absolute top-0 left-0 z-0 w-full h-full bg-black transition delay-100 duration-100 ease-in-out transform scale-x-0 group-hover:scale-x-100"></div>
        </a>
      </div>
    </>
  );
};

export const PageLinkButton2: VFC<ButtonProps> = ({ children, href }) => {
  return (
    <>
      <a href={href} target="_blank" rel="noreferrer">
        <div className="w-full py-4 bg-white text-gray-800 hover:bg-black hover:text-white transition delay-300 duration-300 ease-in-out tracking-wider text-center border-t border-b border-gray-300">
          {children}
        </div>
      </a>
    </>
  );
};

export const GithubButton: VFC<IconButtonProps> = ({ href }) => {
  return (
    <>
      <div className="w-full">
        <div className="ml-auto mr-0 w-6 text-xl text-gray-400 hover:text-gray-800">
          <a
            href={href}
            target="_blank"
            title="リポジトリを開く"
            rel="noreferrer"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </>
  );
};

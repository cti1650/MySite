import Link from 'next/link';
import type React from 'react';
import type { FC } from 'react';
import { FaGithub } from 'react-icons/fa';

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  ariaLabel?: string;
};

type IconButtonProps = {
  href: string;
  ariaLabel?: string;
};

export const SocialButton: FC<ButtonProps> = ({
  children,
  href,
  ariaLabel,
}) => {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      className="text-gray-900 hover:text-opacity-50 transition delay-300 duration-300 ease-in-out rounded text-xs font-thin tracking-wider"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const NavButton: FC<ButtonProps> = ({ children, href, ariaLabel }) => {
  return (
    <div className="group">
      <Link
        href={href}
        aria-label={ariaLabel}
        className="px-0 py-1 box-border text-gray-900 font-light tracking-wider"
      >
        {children}
      </Link>
      <div className="w-full h-0.5 border-b border-black transition delay-100 duration-100 ease-in-out transform scale-x-0 group-hover:scale-x-100" />
    </div>
  );
};

export const PageLinkButton: FC<ButtonProps> = ({
  children,
  href,
  ariaLabel,
}) => {
  return (
    <div className="w-full h-14 group relative overflow-hidden border-t border-b border-gray-300">
      <a href={href} aria-label={ariaLabel} target="_blank" rel="noreferrer">
        <div className="absolute top-0 left-0 z-10 w-full py-4 bg-transparent text-gray-800 group-hover:text-white transition delay-100 duration-100 ease-in-out tracking-wider text-center border-l border-r border-white">
          {children}
        </div>
        <div className="absolute top-0 left-0 z-0 w-full h-full bg-black transition delay-100 duration-100 ease-in-out transform translate-x-full group-hover:translate-x-0"></div>
      </a>
    </div>
  );
};

export const GithubButton: FC<IconButtonProps> = ({ href, ariaLabel }) => {
  const getRepositoryName = () => {
    if (ariaLabel) return ariaLabel;
    const reg = /github\.com\/(.+)(\.git)?/;
    const name = reg.exec(href)?.[1];
    return name;
  };

  return (
    <div className="w-full">
      <div className="ml-auto mr-0 w-6 text-xl text-gray-400 hover:text-gray-800">
        <a
          href={href}
          target="_blank"
          title="リポジトリを開く"
          aria-label={getRepositoryName()}
          rel="noreferrer"
        >
          <FaGithub />
        </a>
      </div>
    </div>
  );
};

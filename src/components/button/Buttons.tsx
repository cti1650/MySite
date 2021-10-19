import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import React from 'react';

export const SocialButton = ({ children, href }) => {
  return (
    <>
      <a href={href} target="_blank" className="text-gray-900 hover:text-opacity-50 transition delay-300 duration-300 ease-in-out rounded text-xs font-thin tracking-wider">
        {children}
      </a>
    </>
  );
}

export const NavButton = ({ children, href }) => {
  return (
    <>
      <Link href={href}>
        <a className='px-0 py-1 box-border text-gray-900 hover:border-b hover:border-black transition delay-100 duration-100 ease-in-out font-light tracking-wider' >
          {children}
        </a>
      </Link>
    </>
  );
}

export const PageLinkButton = ({ children, href }) => {
  return (
    <>
      <a href={href} target="_blank" >
        <div className="w-full py-4 bg-white text-gray-800 hover:bg-black hover:text-white transition delay-300 duration-300 ease-in-out tracking-wider text-center border-t border-b border-gray-300">
          {children}
        </div>
      </a>
    </>
  );
}

export const GithubButton = ({ href }) => {
  return (
    <>
      <div className="w-full">
        <a href={href} target="_blank" title="リポジトリを開く" >
          <FaGithub />
        </a>
      </div>
    </>
  );
}


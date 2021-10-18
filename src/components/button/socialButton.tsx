import Link from 'next/link';
import React from 'react';

export const SocialButton = ({ children, href }) => {
  return (
    <>
      <Link href={href}>
        <a className='px-4 py-1 text-gray-900 hover:text-opacity-50 transition delay-300 duration-300 ease-in-out rounded font-light tracking-wider'>
          {children}
        </a>
      </Link>
    </>
  );
}
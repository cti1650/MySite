import Link from 'next/link';
import React from 'react';
import { TailwindSearch } from '../search/tailwind';

export default function Navbar({ children }) {
  return (
    <>
      <div className='fixed top-0 left-0 px-10 pt-2.5 w-full bg-white z-40'>
        <div className="h-20 flex items-center">
          <div className="w-full h-8 flex flex-row">
            <div className='flex-none h-full py-auto text-center text-3xl font-extrabold tracking-widest'>
              MySite
            </div>
            <ol className='flex-grow w-full py-2 sm:py-4 flex justify-center items-center content-center space-x-6 text-gray-800'>
              <li>
                <Link href='/'>
                  <a className='px-4 py-1 bg-white hover:bg-gray-200 rounded'>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href='/site'>
                  <a className='px-4 py-1 bg-white hover:bg-gray-200 rounded'>
                    Links
                  </a>
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

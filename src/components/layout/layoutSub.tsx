import Navbar from './navbarSub';
import Footer from './footerSub';
import React from 'react';

export default function Layout({ children }) {
  return (
    <>
      <div className='container max-w-screen-md mx-auto text-sans'>
        <Navbar children={undefined} />
        <main className="pt-16">{children}</main>
        <Footer children={undefined} />
      </div>
    </>
  );
}

import Navbar from './navbarSub';
import Footer from './footerSub';
import React from 'react';
import SocialNav from './socialNavbarSub';

export default function Layout({ children }) {
  return (
    <>
      <div className="w-full mx-0 font-n2i">
        <Navbar children={undefined} />
        <main className="pt-16">{children}</main>
        <SocialNav children={undefined} />
        <Footer children={undefined} />
      </div>
    </>
  );
}

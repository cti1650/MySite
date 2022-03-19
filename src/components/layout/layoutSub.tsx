import { Navbar } from './navbarSub';
import { Footer } from './footerSub';
import React, { VFC } from 'react';
import { SocialNav } from './socialNavbarSub';

type Props = {
  children: React.ReactNode;
};

export const Layout: VFC<Props> = ({ children }) => {
  return (
    <>
      <div className="w-full mx-0 font-n2i">
        <Navbar />
        <main className="mt-[90px]">{children}</main>
        <SocialNav />
        <Footer />
      </div>
    </>
  );
};
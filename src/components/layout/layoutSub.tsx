import { Navbar } from './navbarSub';
import { Footer } from './footerSub';
import React, { FC } from 'react';
import { SocialNav } from './socialNavbarSub';

type Props = {
  children?: React.ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className="h-screen w-full mx-0 font-n2i">
      <Navbar />
      <main className="h-full pt-[90px]">
        <Footer />
        <div className="min-h-full h-full px-[40px]">
          <div className="min-h-full h-full container mx-auto">{children}</div>
        </div>
        <SocialNav />
      </main>
    </div>
  );
};

import React from 'react';
import HrumNavbar from '@/components/HrumNavbar';

interface IPrimaryLayoutProps {
  children?: JSX.Element;
}

export function PrimaryLayout({ children }: IPrimaryLayoutProps): JSX.Element {
  return (
    <div>
      <HrumNavbar />
      <main>{children}</main>
    </div>
  );
}

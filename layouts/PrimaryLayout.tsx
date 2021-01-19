import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface IPrimaryLayoutProps {
  children?: JSX.Element;
}

export function PrimaryLayout({ children }: IPrimaryLayoutProps): JSX.Element {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}

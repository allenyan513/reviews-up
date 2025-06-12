'use client';
import { PropsWithChildren } from 'react';

import '@/app/globals.css';
import { UserProvider } from '@/context/UserProvider';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <UserProvider>{children}</UserProvider>
    </>
  );
}

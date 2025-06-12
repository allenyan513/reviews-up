'use client';
import { PropsWithChildren } from 'react';

import '@/app/globals.css';
import { UserProvider } from '@/context/UserProvider';
import ToastContext from '@/context/ToastContext';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <UserProvider>
        {children}
        <ToastContext/>
      </UserProvider>
    </>
  );
}

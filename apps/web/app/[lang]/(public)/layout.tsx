'use client';
import { UserProvider } from '@/context/UserProvider';
import { PropsWithChildren } from 'react';

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return <UserProvider>{children}</UserProvider>;
}

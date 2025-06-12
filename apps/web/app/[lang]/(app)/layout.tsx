'use client';
import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { use, useState } from 'react';
import { UserProvider } from '@/context/UserProvider';
import ToasterContext from '@/context/ToastContext';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = use(props.params);
  return (
    <>
      <UserProvider>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 62)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar lang={lang} variant="inset" />
          <SidebarInset>{props.children}</SidebarInset>
        </SidebarProvider>
        <ToasterContext />
      </UserProvider>
    </>
  );
}

'use client';
import { Open_Sans } from 'next/font/google';

import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import AuthProvider from '@/context/AuthProvider';
import { useState } from 'react';
import { UserProvider } from '@/context/UserProvider';
import ToasterContext from '@/context/ToastContext';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export default function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<string>('en');

  props.params.then((params) => {
    setLang(params.lang);
  });

  return (
    <html lang={lang}>
      <body className={openSans.className}>
        <AuthProvider>
          <UserProvider>
            <SidebarProvider
              style={
                {
                  '--sidebar-width': 'calc(var(--spacing) * 72)',
                  '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
              }
            >
              <AppSidebar lang={lang} variant="inset" />
              <SidebarInset>{props.children}</SidebarInset>
            </SidebarProvider>

            <ToasterContext />
            {/*<Analytics />*/}
            {/*<SpeedInsights />*/}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

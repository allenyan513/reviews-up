'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import AuthProvider from '@/context/AuthProvider';
import { useEffect, useState } from 'react';
import { User } from '@repo/api/users/entities/user.entity';
import {api} from '@/lib/apiClient'

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}

'use client';

import { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  {
    name: 'Profile',
    href: '/account/profile',
  },
  {
    name: 'My Reviews',
    href: '/account/my-reviews',
  },
  {
    name: 'Billing',
    href: '/account/billing',
  },
  {
    name: 'Notifications',
    href: '/account/notifications',
  },
];

export default function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const params = use(props.params);
  const path = usePathname();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Account</h1>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={`/${params.lang}${tab.href}`}
              className={cn(
                'px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                path.includes(tab.href) ? 'bg-gray-200 ' : '',
              )}
            >
              {tab.name}
            </a>
          ))}
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}

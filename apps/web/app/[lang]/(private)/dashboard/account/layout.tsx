'use client';

import { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

const tabs = [
  {
    name: 'Profile',
    href: '/dashboard/account/profile',
  },
  {
    name: 'My Reviews',
    href: '/dashboard/account/my-reviews',
  },
  {
    name: 'Billing',
    href: '/dashboard/account/billing',
  },
  {
    name: 'Notifications',
    href: '/dashboard/account/notifications',
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
    <DashboardRoot>
      <DashboardHeader
        title="Account Settings"
        subtitle="Manage your account settings and preferences."
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-1">
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
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
    </DashboardRoot>
  );
}

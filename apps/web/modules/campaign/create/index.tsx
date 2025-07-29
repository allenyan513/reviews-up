'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import { CampaignCreateConfigPage } from './config';
import { CampaignCreatePreviewPage } from './preview';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

export function CampaignCreatePage(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
  searchParams: Promise<{
    formId?: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  const { formId } = use(props.searchParams);

  return (
    <DashboardRoot>
      <DashboardHeader
        title="Create Campaign"
        subtitle="Configure your campaign settings and preview the email."
        url={`/${lang}/dashboard/${productId}/campaigns`}
        enableBack={true}
        buttons={null}
      />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5 flex flex-col">
          <CampaignCreateConfigPage />
        </div>
        <div className="col-span-7">
          <CampaignCreatePreviewPage />
        </div>
      </div>
    </DashboardRoot>
  );
}

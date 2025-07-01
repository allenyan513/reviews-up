'use client';

import React, { use } from 'react';
import { useCampaignContext } from '@/modules/campaign/context/campaign-provider';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/campaign/columens';

export default function CampaignListPage(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const { findAll } = useCampaignContext();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Create and send email marketing campaigns to invite your users to
            leave feedback and reviews.
          </p>
        </div>
        <Link
          href={`/${lang}/${workspaceId}/campaigns/create`}
          className={buttonVariants({
            size: 'lg',
          })}
        >
          Create Campaign
        </Link>
      </div>
      <DataTable fetchData={findAll} columns={columns} />
    </div>
  );
}

'use client';

import React, {use, useEffect, useState} from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import {useCampaignContext} from "@/modules/campaign/context/campaign-provider";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {CampaignListItem} from './campagin-list-item';
import {api} from "@/lib/api-client";
import {DataTable} from "@/modules/review/table/data-table";

export default function CampaignListPage(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const {lang, workspaceId} = use(props.params);
  const {campaigns} = useCampaignContext();


  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-gray-600">
            Create and send email marketing campaigns to invite your users to leave feedback and reviews.
          </p>
        </div>
        {/*<CreateFormDialog/>*/}
        <Link
          href={`/${lang}/${workspaceId}/campaigns/create`}
          className={buttonVariants({
            size: 'lg',
          })}>
          Create Campaign
        </Link>

      </div>
      {/*<DataTable*/}
      {/*  fetchData={fetchData}*/}
      {/*/>*/}
      <div className="space-y-4">
        {campaigns && campaigns.length > 0 && campaigns.map((item) => (
          <CampaignListItem
            key={item.id}
            lang={lang}
            workspaceId={workspaceId}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

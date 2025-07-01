'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import { CampaignCreateConfigPage } from './config';
import { CampaignCreatePreviewPage } from './preview';

export function CampaignCreatePage(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
  searchParams: Promise<{
    formId?: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const { formId } = use(props.searchParams);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${workspaceId}/campaigns`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-3xl font-semibold text-gray-900">
              Create Campaign
            </h1>
          </Link>
          <p className="mt-1 text-gray-600">
            Create a new campaign to send emails to your users.
          </p>
        </div>
        <div className={'space-x-2'}></div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5 flex flex-col">
          <CampaignCreateConfigPage />
        </div>
        <div className="col-span-7">
          <CampaignCreatePreviewPage />
        </div>
      </div>
    </div>
  );
}

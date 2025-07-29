'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import { CampaignCreateConfigPage } from '../create/config';
import { CampaignCreatePreviewPage } from '../create/preview';
import { useCampaignContext } from '@/modules/campaign/context/campaign-provider';
import { CampaignEntity } from '@reviewsup/api/campaign';

export function CampaignIdPage(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const { lang, productId, id } = use(props.params);
  const { findOne } = useCampaignContext();
  const [campaign, setCampaign] = useState<CampaignEntity | null>(null);

  useEffect(() => {
    if (!id) return;
    findOne(id)
      .then((data) => {
        setCampaign(data);
      })
      .catch((error) => {
        console.error('Error fetching campaign:', error);
      });
  }, [id]);

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/dashboard/${productId}/campaigns`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-3xl font-semibold text-gray-900">
              {campaign.name}
            </h1>
          </Link>
          <p className="mt-1 text-gray-600"></p>
        </div>
        <div className={'space-x-2'}></div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5 flex flex-col">
          <CampaignCreateConfigPage data={campaign} mode="view" />
        </div>
        <div className="col-span-7">
          <CampaignCreatePreviewPage data={campaign} mode="view" />
        </div>
      </div>
    </div>
  );
}

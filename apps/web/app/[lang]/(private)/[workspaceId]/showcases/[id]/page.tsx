'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave, BiShow } from 'react-icons/bi';
import { api } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  ShowcaseConfig,
  ShowcaseEntity,
} from '@repo/api/showcases/entities/showcase.entity';
import PageConfig from '@/app/[lang]/(private)/[workspaceId]/showcases/[id]/page-config';
import PageReview from '@/app/[lang]/(private)/[workspaceId]/showcases/[id]/page-review';
import ShowcasePageReview from '@/app/[lang]/(private)/[workspaceId]/showcases/[id]/page-review';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const params = use(props.params);
  const session = useSession({
    required: true,
  });
  const [showcase, setShowcase] = useState<ShowcaseEntity>();
  const [showcaseConfig, setShowcaseConfig] = useState<ShowcaseConfig>({
    type: '',
  });

  useEffect(() => {
    if (!session.data) return;
    api
      .getShowcase(params.id, {
        session: session.data,
      })
      .then((response) => {
        setShowcase(response);
        setShowcaseConfig(response.config as ShowcaseConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session, params]);

  if (!showcase || !showcase.reviews) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${params.lang}/${params.workspaceId}/showcases`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-3xl font-semibold text-gray-900">
              Edit {showcase.name}
            </h1>
          </Link>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <div className={'space-x-2'}>
          <Button variant="outline" size={'lg'}>
            <BiCodeAlt className="text-2xl" />
            Add to your website
          </Button>
          <Button
            onClick={() => {
              window.open(`/showcases/${showcase.shortId}`, '_blank');
            }}
            variant="outline"
            size={'lg'}
          >
            <BiShow className="text-2xl" />
            View
          </Button>
          <Button size={'lg'}>
            <BiSave className="text-2xl" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <PageConfig
          showcase={showcase}
          showcaseConfig={showcaseConfig}
          setShowcaseConfig={setShowcaseConfig}
        />
        <ShowcasePageReview
          showcase={showcase}
          showcaseConfig={showcaseConfig}
        />
      </div>
    </div>
  );
}

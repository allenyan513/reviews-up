'use client';

import { useEffect, useState, use } from 'react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave, BiShow } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ShowcasePageReviewClient } from '@reviewsup/embed-react';
import { BsBoxArrowUpRight, BsShare } from 'react-icons/bs';
import { ShowcasePageConfig } from '@/modules/showcase/showcase-page-config';
import { useShowcaseContext } from '@/modules/showcase/context/showcase-context';
import { ShowcaseEmbedDialog } from '@/modules/showcase/showcase-embed-dialog';

export default function ShowcaseIdPage(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const params = use(props.params);
  const { getShowcase, showcase, showcaseConfig } = useShowcaseContext();
  useEffect(() => {
    if (!params.id) return;
    getShowcase(params.id);
  }, [params]);

  if (!showcase || !showcase.reviews) return null;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${params.lang}/${params.workspaceId}/showcases`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Edit {showcase.name}
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <div className={'flex flex-row gap-1'}>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/showcases/${showcase.shortId}`,
              );
              toast.success('Link copied to clipboard!');
            }}
            variant="outline"
            size={'lg'}
          >
            <BsShare className="text-2xl" />
            <span className="hidden md:flex">Share</span>
          </Button>
          <Button
            onClick={() => {
              window.open(`/showcases/${showcase.shortId}`, '_blank');
            }}
            variant="outline"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            <span className="hidden md:flex">Open</span>
          </Button>
          <ShowcaseEmbedDialog
            url={''}
            showcaseShortId={showcase.shortId || ''}>
            <Button className="" variant="default" size={'lg'}>
              <BiCodeAlt className="text-2xl" />
              <span className="hidden md:flex">Add to your website</span>
            </Button>
          </ShowcaseEmbedDialog>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        <div className={'flex flex-col md:col-span-1 w-full gap-2'}>
          <ShowcasePageConfig />
        </div>
        <div className="md:col-span-3 bg-gray-50 p-8 border rounded shadow h-[750px] overflow-y-auto items-center justify-center">
          <ShowcasePageReviewClient
            showcase={showcase}
            showcaseConfig={showcaseConfig}
          />
        </div>
      </div>
    </div>
  );
}

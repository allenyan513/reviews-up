'use client';

import { useEffect, useState, use } from 'react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave, BiShow } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ShowcasePageReview from '@/modules/showcase/showcase-page-review';
import { BsBoxArrowUpRight, BsShare } from 'react-icons/bs';
import { ShowcasePageConfig } from '@/modules/showcase/showcase-page-config';
import { useShowcaseContext } from '@/modules/showcase/context/ShowcaseProvider';
import { CopyCodeDialog } from '@/components/copy-code-dialog';

export default function Page(props: {
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
    <div className="p-6 md:p-8">
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
          <CopyCodeDialog
            title={'Embed your showcase'}
            codes={[
              `<div id="reviewsup-showcase-${showcase.shortId}"></div>`,
              `<script id="revewsup-embed-js" type="text/javascript"`,
              `src="${process.env.NEXT_PUBLIC_APP_URL}/js/embed.js" defer></script>`,
            ]}
          >
            <Button variant="outline" size={'lg'}>
              <BiCodeAlt className="text-2xl" />
              Add to your website
            </Button>
          </CopyCodeDialog>

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
            Share
          </Button>
          <Button
            onClick={() => {
              window.open(`/showcases/${showcase.shortId}`, '_blank');
            }}
            variant="default"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            Open
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4">
        <div className={''}>
          <ShowcasePageConfig />
        </div>
        {/*Preview*/}
        <div className="col-span-3 bg-gray-50 p-8 border rounded shadow h-[750px] overflow-y-auto items-center justify-center">
          <ShowcasePageReview
            showcase={showcase}
            showcaseConfig={showcaseConfig}
          />
        </div>
      </div>
    </div>
  );
}

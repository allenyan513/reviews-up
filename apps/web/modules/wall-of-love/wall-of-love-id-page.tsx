'use client';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { WallOfLovePage } from '@/modules/wall-of-love/wall-of-love-page';
import { use, useEffect, useState } from 'react';
import { WallOfLoveConfigPage } from '@/modules/wall-of-love/wall-of-love-config-page';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { BsBoxArrowUpRight, BsCodeSlash, BsCopy } from 'react-icons/bs';
import { useUserContext } from '@/context/UserProvider';
import { api } from '@/lib/api-client';
import { useWallOfLoveContext } from '@/modules/wall-of-love/wall-of-love-context';

export function WallOfLoveIdPage(props: { lang: string; productId: string }) {
  const { lang, productId } = props;
  const { defaultProduct } = useUserContext();
  const { wallOfLove, setWallOfLove } = useWallOfLoveContext();
  const wallOfLoveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${defaultProduct?.slug}/wall-of-love`;

  useEffect(() => {
    if (!defaultProduct || !defaultProduct.slug) {
      return;
    }
    api.wallOfLove
      .findOneByProductId(defaultProduct.slug)
      .then((wallOfLove) => {
        if (wallOfLove) {
          setWallOfLove(wallOfLove);
        } else {
          toast.error('Wall of Love not found for this product.');
        }
      });
  }, [defaultProduct]);

  if (!wallOfLove) {
    return null;
  }

  return (
    <DashboardRoot>
      <DashboardHeader
        title="Wall of Love"
        subtitle="A collection of positive feedback and testimonials from our users."
        buttons={
          <>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(wallOfLoveUrl);
                toast.success('Link copied to clipboard!');
              }}
              variant="outline"
              size={'lg'}
            >
              <BsCopy className="text-2xl" />
              <span className="hidden md:inline">Copy Link</span>
            </Button>
            <Button onClick={() => {}} variant="outline" size={'lg'}>
              <BsCodeSlash className="text-2xl" />
              <span className="hidden md:inline">Embed Page</span>
            </Button>
            <Button
              onClick={() => {
                window.open(wallOfLoveUrl);
              }}
              variant="default"
              size={'lg'}
            >
              <BsBoxArrowUpRight className="text-2xl" />
              <span className="hidden md:inline">Preview</span>
            </Button>
          </>
        }
      />
      <DashboardContent className="flex flex-col md:grid md:grid-cols-12 gap-4 w-full">
        <WallOfLoveConfigPage className="md:col-span-3" />
        <WallOfLovePage
          lang={lang}
          wallOfLove={wallOfLove}
          className="md:col-span-9 border border-gray-200 rounded-lg shadow-md bg-white h-full overflow-y-auto"
        />
      </DashboardContent>
    </DashboardRoot>
  );
}

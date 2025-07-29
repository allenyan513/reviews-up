'use client';

import React, { use, useEffect, useState } from 'react';
import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BsPencil,
  BsBoxArrowUpRight,
  BsClock,
  BsCheckCircle,
} from 'react-icons/bs';
import { useUserContext } from '@/context/UserProvider';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductStatusLabel } from '@/modules/product/product-status-label';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

export function LaunchPage(props: { lang: string; productId: string }) {
  const { lang, productId } = props;
  const { defaultProduct } = useUserContext();
  const router = useRouter();

  if (!defaultProduct) {
    return null;
  }

  return (
    <DashboardRoot>
      <DashboardHeader
        title={defaultProduct?.name || 'My Product'}
        subtitle={''}
        buttons={
          <>
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/dashboard/${defaultProduct?.id}/overview/edit`);
              }}
              variant="outline"
            >
              <BsPencil />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `${process.env.NEXT_PUBLIC_APP_URL}/products/${defaultProduct?.slug}`,
                  '_blank',
                );
              }}
            >
              <BsBoxArrowUpRight />
              View Product
            </Button>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <p>Product Status:</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <ProductStatusLabel product={defaultProduct} />
            </TooltipTrigger>
            <TooltipContent className="text-md max-w-md">
              <strong>Waiting for Your Submit</strong>: You need to submit more
              reviews. When the number of reviews you’ve submitted exceeds the
              number of reviews you've received, your product will move to the
              "Listing in Queue" state.
              <br />
              <strong>Listing in Queue</strong>: Your product is currently in
              the review queue. You can find it under "Apps to Review".
              <br />
              <strong>Listing in Public</strong>: You’ve completed all required
              tasks. Your product is now publicly listed and open to all users
              for reviews — no more actions needed on your side.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-row items-center gap-2 ">
          <p className="">Submitted:</p>
          <p className="">
            {defaultProduct?.submitReviewCount}
            {defaultProduct?.status === 'listing'
              ? ''
              : `/${defaultProduct?.taskReviewCount}`}
          </p>
        </div>
      </div>
    </DashboardRoot>
  );
}

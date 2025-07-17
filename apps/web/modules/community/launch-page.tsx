'use client';

import React, { use, useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@reviewsup/ui/dropdown-menu';
import Link from 'next/link';
import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import ProductStatusFlow, {
  StatusStep,
} from '@/components/product-status-flow';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BsEye,
  BsInfoCircle,
  BsPencil,
  BsThreeDotsVertical,
  BsTrash,
  BsBoxArrowUpRight,
  BsRocket,
} from 'react-icons/bs';
import { redirect, useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserProvider';
import { buttonVariants } from '@reviewsup/ui/button';

function MyProductItem(props: { lang: string; product: ProductEntity }) {
  const { product, lang } = props;

  return (
    <div
      key={product.id}
      className="border border-gray-200 rounded-lg p-4 bg-white shadow-md gap-2 flex flex-col"
    >
      <div className="flex flex-row items-center gap-2 justify-between">
        <div className="flex flex-row items-center gap-3">
          <img className="w-5 h-5" src={product.icon} alt={product.name} />
          <h2 className="text-2xl line-clamp-1">{product.name}</h2>
          <Link
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${product.slug}`}
            className="text-xl"
          >
            <BsBoxArrowUpRight />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2 text-lg">
          <Link
            href={`/${lang}/${product.id}/community/myproduct/edit`}
            className={buttonVariants({
              variant: 'outline',
              size: 'sm',
            })}
          >
            <BsRocket />
            Upgrade
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <BsThreeDotsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      `${process.env.NEXT_PUBLIC_WWW_URL}/products/${product.slug}`,
                      '_blank',
                    );
                  }}
                >
                  <BsEye /> View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {}}>
                  <BsPencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {}}>
                  <BsTrash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 py-2 gap-4">
        <div className="text-gray-600 col-span-6">
          <p className="font-medium mb-2 flex flex-row items-center gap-2">
            Product Status:
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <BsInfoCircle />
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-md max-w-md">
                <strong>Waiting for Your Submit</strong>: You need to submit
                more reviews. When the number of reviews you’ve submitted
                exceeds the number of reviews you've received, your product will
                move to the "Listing in Queue" state.
                <br />
                <strong>Listing in Queue</strong>: Your product is currently in
                the review queue. You can find it under "Apps to Review".
                <br />
                <strong>Listing in Public</strong>: You’ve completed all
                required tasks. Your product is now publicly listed and open to
                all users for reviews — no more actions needed on your side.
              </TooltipContent>
            </Tooltip>
          </p>
          <ProductStatusFlow
            status={product.status as StatusStep}
          />
          {product.status === ProductStatus.pendingForReceive && (
            <div className="flex flex-col mt-4">
              <p>Task:</p>
              <ul className="list-decimal pl-4">
                <li className='text-sm'>
                  Write at least <strong>{product.taskReviewCount}</strong> reviews for other
                  products.
                  <Link
                    className="text-blue-500 hover:underline ml-2"
                    href={`/${product.id}/community/explore`}>
                    Explore Products
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/*<div className="text-gray-600 col-span-3">*/}
        {/*  <p className="">Received:</p>*/}
        {/*  <p className="text-5xl mt-4">*/}
        {/*    {product.receiveReviewCount}*/}
        {/*    {product.status === 'listing'*/}
        {/*      ? ''*/}
        {/*      : `/${product.submitReviewCount}`}*/}
        {/*  </p>*/}
        {/*</div>*/}
        <div className="text-gray-600 col-span-3">
          <p className="">Submitted:</p>
          <p className="text-5xl mt-4">
            {product.submitReviewCount}
            {product.status === 'listing' ? '' : `/${product.taskReviewCount}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LaunchPage(props: { lang: string; productId: string }) {
  const { lang, productId } = props;
  const { defaultProduct } = useUserContext();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
            My Product
          </h1>
          <p className="mt-1 text-gray-600 hidden md:flex">
            {/*加入这个产品评测社区，体验并为其他产品提交review或者推荐词*/}
            Join this product review community to experience and submit reviews
            or recommendations for other products.
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}></div>
      </div>

      <div className="flex flex-col gap-4">
        {defaultProduct && (
          <MyProductItem product={defaultProduct} lang={lang} />
        )}
      </div>
    </div>
  );
}

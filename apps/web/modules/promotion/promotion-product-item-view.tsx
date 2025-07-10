'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductEntity } from '@reviewsup/api/products';
import { buttonVariants } from '@reviewsup/ui/button';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { ReviewEntity } from '@reviewsup/api/reviews';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { UserEntity } from '@reviewsup/api/users';

export function ProductItemView(props: {
  product: ProductEntity;
  user?: UserEntity;
  submittedReviews?: ReviewEntity[];
}) {
  const { product, user, submittedReviews } = props;

  const renderButton = (product: ProductEntity) => {
    let message = '';
    if (product.userId === user?.id) {
      message = "You can't review your own product.";
    }

    const formId = product.formId;
    const hasSubmittedReview = submittedReviews?.some(
      (review) => review.formId === formId,
    );
    if (hasSubmittedReview) {
      // return <p>You have already submitted a review for this product.</p>;
      message = 'You have already submitted a review for this product.';
    }
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {message ? (
            <span
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'sm',
                }),
                'cursor-not-allowed opacity-50 mb-2 mx-2 text-sm',
              )}
            >
              Leave a Review
            </span>
          ) : (
            <Link
              href={`/forms/${product.form?.shortId}`}
              target={'_blank'}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'mb-2 mx-2 text-sm',
              )}
            >
              Leave a Review
            </Link>
          )}
        </TooltipTrigger>
        {message && (
          <TooltipContent>
            <p>{message}</p>
          </TooltipContent>
        )}
      </Tooltip>
    );
  };
  return (
    <div
      key={product.id}
      className="border border-gray-200 rounded-md bg-white shadow-md flex flex-col flex-grow"
    >
      {product.screenshot ? (
        <Link
          href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${product.slug}`}
          target="_blank"
        >
          <img
            className="w-full rounded-t-md border-b aspect-video object-cover"
            src={product.screenshot}
            alt={product.name}
          />
        </Link>
      ) : (
        <div className="w-full rounded-t-md border-b aspect-video bg-gray-100 flex items-center justify-center"></div>
      )}
      <Link
        href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${product.slug}`}
        target="_blank"
        className="flex flex-col flex-grow gap-2 p-4"
      >
        <div className="flex flex-row items-center gap-2">
          {product.icon ? (
            <img className="w-5 h-5" src={product.icon} alt={product.name} />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center"></div>
          )}
          <h2 className={'line-clamp-1'}>{product.name ? product.name : 'YOUR PRODUCT NAME'}</h2>
        </div>
        <p className="text-sm text-gray-600 min-h-10 line-clamp-2 whitespace-break-spaces overflow-x-hidden">
          {product.description
            ? product.description
            : 'YOUR PRODUCT DESCRIPTION'}
        </p>
        <div className="text-sm text-gray-500">
          <span>#{product.category}</span>
        </div>
      </Link>
      {renderButton(product)}
    </div>
  );
}

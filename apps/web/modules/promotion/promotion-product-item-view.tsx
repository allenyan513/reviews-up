'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductEntity } from '@reviewsup/api/products';
import { buttonVariants } from '@reviewsup/ui/button';
import { BiPlus, BiShareAlt } from 'react-icons/bi';
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
          <Link
            href={`/forms/${product.form?.shortId}`}
            target={'_blank'}
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'lg',
              }),
              message ? 'cursor-not-allowed opacity-50' : '',
            )}
          >
            Start Review
          </Link>
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
      className="border border-gray-200 rounded-md bg-white shadow-md flex flex-col"
    >
      {product.screenshot && (
        <img
          className="w-full rounded-t-md border-b aspect-video object-cover"
          src={product.screenshot}
          alt={product.name}
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-row items-center gap-2">
          {product.icon && (
            <img className="w-5 h-5" src={product.icon} alt={product.name} />
          )}
          <h2 className="">{product.name}</h2>
          <Link href={product.url || ''} target="_blank">
            <BiShareAlt />
          </Link>
        </div>
        <p className="text-sm text-gray-600 min-h-10 line-clamp-2 whitespace-break-spaces overflow-x-hidden">
          {product.description}
        </p>
        {renderButton(product)}
      </div>
    </div>
  );
}

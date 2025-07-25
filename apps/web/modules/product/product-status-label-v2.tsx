import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import { BsCheckCircle, BsClock } from 'react-icons/bs';
import { Button } from '@reviewsup/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ProductStatusLabelV2(props: {
  product: ProductEntity | undefined | null;
}) {
  const { product } = props;
  if (!product) {
    return null;
  }
  const { status } = product;
  if (!status) {
    return null;
  }
  return (
    <span
      className={cn(
        'text-xs',
        status === ProductStatus.pendingForSubmit && 'text-amber-500',
        status === ProductStatus.pendingForReceive && 'text-amber-500',
        status === ProductStatus.listing && 'text-green-500',
      )}
    >
      {status === ProductStatus.pendingForSubmit && 'Submitting'}
      {status === ProductStatus.pendingForReceive && 'Waiting reviews'}
      {status === ProductStatus.listing && 'Published'}
    </span>
  );
}

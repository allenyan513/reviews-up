import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import { BsCheckCircle, BsClock } from 'react-icons/bs';
import { Button } from '@reviewsup/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';

export function ProductStatusLabel(props: {
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
  const router = useRouter();

  if (status === ProductStatus.pendingForSubmit) {
    return (
      <div className="flex flex-row items-center gap-1 font-semibold">
        <BsClock className="w-4 h-4 text-amber-500" />
        <span className="text-amber-500">Submitting</span>
        <Button
          variant="default"
          size="sm"
          className="ml-1"
          onClick={() => {
            router.push(`/products/new/${product.id}`);
          }}
        >
          Continue
        </Button>
      </div>
    );
  } else if (status === ProductStatus.pendingForReceive) {
    return (
      <div className="flex flex-row items-center gap-1 font-semibold">
        <BsClock className="w-4 h-4 text-amber-500" />
        <span className="text-amber-500">
          Writing{' '}
          {(product.taskReviewCount || 3) - (product.submitReviewCount || 0)}{' '}
          reviews
        </span>
        <Button
          variant="default"
          size="sm"
          className="ml-1"
          onClick={() => {
            window.open(
              `${process.env.NEXT_PUBLIC_WWW_URL}/products`,
              '_blank',
            );
          }}
        >
          Go to Reviews
        </Button>
      </div>
    );
  } else if (status === ProductStatus.listing) {
    return (
      <div className="flex flex-row items-center gap-1 font-semibold">
        <BsCheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-green-500">Published</span>
      </div>
    );
  } else {
    return null;
  }
}

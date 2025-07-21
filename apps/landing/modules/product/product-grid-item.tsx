import React from 'react';
import Link from 'next/link';
import { ProductEntity } from '@reviewsup/api/products';
import { StarRatingServer } from '@reviewsup/embed-react';

export function ProductGridItemView(props: { product: ProductEntity }) {
  const { product } = props;
  return (
    <div
      key={product.id}
      className="border border-gray-200 rounded-md bg-white shadow-md flex flex-col flex-grow"
    >
      {product.screenshots ? (
        <Link href={`/products/${product.slug}`}>
          <img
            className="w-full rounded-t-md border-b aspect-video object-cover"
            src={product.screenshots[0]}
            alt={product.name}
          />
        </Link>
      ) : (
        <div className="w-full rounded-t-md border-b aspect-video bg-gray-100 flex items-center justify-center"></div>
      )}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-grow gap-2 p-4"
      >
        <div className="flex flex-row items-center gap-2">
          {product.icon ? (
            <img className="w-5 h-5" src={product.icon} alt={product.name} />
          ) : (
            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center"></div>
          )}
          <h2 className="line-clamp-1">
            {product.name ? product.name : 'YOUR PRODUCT NAME'}
          </h2>
        </div>
        <p className="text-sm text-gray-600 min-h-10 line-clamp-2 whitespace-break-spaces overflow-x-hidden">
          {product.description
            ? product.description
            : 'YOUR PRODUCT DESCRIPTION'}
        </p>
        <div className="flex flex-row items-center gap-2 text-sm">
          <StarRatingServer
            size={'sm'}
            value={product?.reviewRating || 0}
          />
          <span className="font-semibold text-black">
            {product.reviewRatingStr}
          </span>
          <span className="text-gray-500">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </Link>
    </div>
  );
}

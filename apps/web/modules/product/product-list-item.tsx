import React from 'react';
import Link from 'next/link';
import { ProductCategory, ProductEntity } from '@reviewsup/api/products';
import { StarRatingServer } from '@reviewsup/embed-react';
import { BsTag } from 'react-icons/bs';

export function ProductListItemView(props: {
  index: number;
  product: ProductEntity;
}) {
  const { index, product } = props;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="w-full flex flex-row flex-grow gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    >
      {product.icon ? (
        <img
          className="w-12 h-12 rounded"
          src={product.icon}
          alt={product.name}
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center"></div>
      )}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col items-start gap-1">
          <h2 className="line-clamp-1 text-lg text-black">
            {index + 1}. {product.name ? product.name : 'YOUR PRODUCT NAME'}
          </h2>
          <p className="text-md text-gray-600 line-clamp-2 whitespace-break-spaces overflow-x-hidden">
            {product.tagline ? product.tagline : 'YOUR PRODUCT DESCRIPTION'}
          </p>
          <div className="flex flex-row flex-wrap gap-2 items-center text-gray-500 text-sm">
            <BsTag />
            {product.tags && product.tags.length > 0 ? (
              product.tags.map((tag, index) => (
                <span key={index}>
                  #{ProductCategory[tag as keyof typeof ProductCategory]}
                </span>
              ))
            ) : (
              <span className="text-gray-500">No tags available</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 text-sm">
          <span className="font-semibold text-black text-lg">
            {product.reviewRatingStr}
          </span>
          <StarRatingServer size={'sm'} value={product?.reviewRating || 0} />
          <span className="text-gray-500">{product.reviewCount} reviews</span>
        </div>
      </div>
    </Link>
  );
}

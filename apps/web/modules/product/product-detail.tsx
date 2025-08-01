import { fetchProductDetail } from '@/actions/fetch-product-detail';
import Link from 'next/link';
import { BsPencil } from 'react-icons/bs';
import { ProductCategory, ProductStatus } from '@reviewsup/api/products';
import { StarRatingServerWrapper } from '@/modules/product/star-rating-server-wrapper';
import { ReviewItemsWrapper } from './review-item-wrapper';
import { LinkDoFollow } from '@reviewsup/ui/link-dofollow';
import React from 'react';
import { ReviewsupAvatar } from '@reviewsup/ui/reviewsup-avatar';

export function toLocalDateString(date: Date | string): string {
  const _date = new Date(date);
  const locale =
    typeof navigator !== 'undefined' ? navigator.language : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(_date);
}

export async function ProductDetail(props: { lang: string; slug: string }) {
  const { lang, slug } = props;
  const product = await fetchProductDetail(slug);
  if (
    !product ||
    product.status === ProductStatus.waitingForAdminReview ||
    product.status === ProductStatus.rejected ||
    product.status === ProductStatus.draft ||
    product.status === ProductStatus.pendingForSubmit
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-4">
          The product you are looking for is not available or has not been
          approved yet.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-12 flex flex-col gap-8 py-24 px-4 max-w-7xl mx-auto">
      <main className="lg:col-span-9 flex flex-col gap-4 min-h-screen">
        {/*header*/}
        <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            {product.icon && (
              <img
                className="w-18 h-18 rounded object-cover aspect-video "
                src={product.icon}
                alt={product.name}
              />
            )}
            {/*Name Tagline Rating*/}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {product.name}
                {product.status === ProductStatus.pendingForReceive && (
                  <span className="text-yellow-500 ml-2 uppercase">
                    (Pending)
                  </span>
                )}
              </h1>
              <h2 className="text-gray-500 line-clamp-1 max-w-lg">
                {product.tagline}
              </h2>
              <div className="flex flex-row items-center gap-2 text-md mt-1">
                <StarRatingServerWrapper
                  value={parseFloat(product.reviewRatingStr || '0')}
                />
                <span className="font-semibold text-black">
                  {product.reviewRatingStr}
                </span>
                <span className="text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/*  Actions*/}
          <div className="flex flex-row items-center gap-2 text-sm">
            <Link
              className="rounded-md bg-red-400 text-white px-3 py-2 inline-flex items-center gap-2 hover:bg-red-500 transition-colors duration-300"
              href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${product.bindingFormId}`}
              target="_blank"
            >
              <BsPencil />
              <span>Write a review</span>
            </Link>
            <LinkDoFollow
              className="rounded-md bg-white text-black px-3 py-2 inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
              href={product.url || '#'}
              isDoFollow={product.status === ProductStatus.listing}
              isExternal={true}
            >
              <span>Visit Website</span>
            </LinkDoFollow>
          </div>
        </div>
        {/*Tags*/}
        <div className="flex flex-row flex-wrap gap-2">
          {product.tags && product.tags.length > 0 ? (
            product.tags.map((tag, index) => (
              <Link
                key={index}
                href={`/categories/${tag}`}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-300"
              >
                {ProductCategory[tag as keyof typeof ProductCategory]}
              </Link>
            ))
          ) : (
            <span className="text-gray-500">No tags available</span>
          )}
        </div>
        {/*Description*/}
        <p className="text-gray-700 text-md">
          {product.description || 'No description available for this product.'}
        </p>
        {/*ScreenShots*/}
        {product.screenshots && product.screenshots.length > 0 && (
          <div className="flex flex-row gap-4 overflow-x-auto">
            {product.screenshots.map((screenshot, index) => {
              if (!screenshot) {
                return null;
              }
              return (
                <Link
                  key={index}
                  href={screenshot}
                  target="_blank"
                  className="flex-shrink-0"
                >
                  <img
                    className="rounded w-auto h-48 object-cover shadow-sm hover:shadow-lg transition-shadow duration-300"
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                  />
                </Link>
              );
            })}
          </div>
        )}
        {/*  reviews*/}
        <h2 className="mt-8 text-lg font-semibold">{product.name} Reviews</h2>
        <ReviewItemsWrapper reviews={product.reviews || []} />
      </main>
      <aside className="col-span-3 lg:flex lg:flex-col hidden text-sm text-gray-500 gap-4">
        <p>PUBLISHER</p>
        <div className="flex flex-row gap-2 items-center">
          <ReviewsupAvatar
            uri={product.user?.avatarUrl}
            name={product.user?.name}
            size="lg"
          />
          <span className="text-gray-900">{product.user?.name}</span>
        </div>
        <div className="flex flex-row gap-2 items-center ">
          <span className="">LAUNCH DATE</span>
          <hr className="border-gray-300 flex-1" />
          <span className="text-gray-500 uppercase">
            {toLocalDateString(product.createdAt || '')}
          </span>
        </div>
        {/*<div className="flex flex-row items-center gap-4">*/}
        {/*  <p className="font-semibold">Added On:</p>*/}
        {/*  <p className="">{toLocalDateString(product.createdAt || '')}</p>*/}
        {/*</div>*/}
      </aside>
    </div>
  );
}

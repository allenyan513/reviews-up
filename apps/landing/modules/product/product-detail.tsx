import { fetchProductDetail } from '@/actions/fetch-product-detail';
import Link from 'next/link';
import { BsBoxArrowUp, BsPencil } from 'react-icons/bs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProductEntity } from '@reviewsup/api/products';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { StarRatingServer } from '@reviewsup/embed-react';
import React, { Suspense } from 'react';
import { ProductDetailReviews } from './product-detail-reviews';

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

  return (
    <div>
      <div className="flex flex-col gap-8 pt-24 pb-8 px-4 md:px-48 bg-linear">
        <div className="flex flex-row gap-2 items-center">
          {product.icon && (
            <img
              className="w-12 h-12 rounded object-cover aspect-video"
              src={product.icon}
              alt={product.name}
            />
          )}
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <h2 className="text-gray-500 line-clamp-1">
              {product.description}
            </h2>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <Link href={product.url || ''} target="_blank">
              <img
                className="rounded object-cover aspect-video shadow-sm hover:shadow-lg transition-shadow duration-300"
                src={product.screenshot}
                alt={product.name}
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col gap-3 justify-start items-start">
            <div className="flex flex-row items-center gap-4">
              <Link
                className="rounded-full bg-red-400 text-white px-3 py-2 inline-flex items-center gap-2 hover:bg-red-500 transition-colors duration-300"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${product.formShortId}`}
                target="_blank"
              >
                <BsPencil />
                <span>Write a review</span>
              </Link>
              <Link
                className="rounded-full bg-white text-black px-3 py-2 inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                href={product.url || ''}
                target="_blank"
              >
                <BsBoxArrowUp />
                <span>Visit {product.name}</span>
              </Link>
            </div>
            <div className="flex flex-row items-center gap-2 text-lg">
              <span className="text-yellow-500 font-bold">
                {product.reviewRating}
              </span>
              <StarRatingServer
                className="mt-[1px]"
                size={'md'}
                value={parseFloat(product?.reviewRating?.toString() || '0')}
              />
              <span className="text-black text-md">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex flex-row items-center gap-4">
              <p className="font-semibold">Added On:</p>
              <p className="">{toLocalDateString(product.createdAt || '')}</p>
            </div>
            <p className="font-semibold">Categories:</p>
            <div className="flex flex-row flex-wrap gap-2">
              <Link href={``} className="product-category">
                {product.category}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:grid-cols-12 md:grid gap-8 px-4 md:px-48 py-8 w-full">
        <div className="md:col-span-8 flex flex-col gap-4">
          <h2 className="h2">{product.name} Reviews</h2>
          <ProductDetailReviews
            showcaseShortId={product.showcaseShortId || ''}
            options={{
              url: process.env.NEXT_PUBLIC_API_URL as string,
            }}
          />
          <p className="h2">{product.name} Product Information</p>
          <div className="flex flex-col rounded border border-gray-300 px-5 py-4 gap-2 bg-white">
            {product.longDescription && (
              <>
                <h2 className="h3">What is {product.name}?</h2>
                <div className="rich-text text-start">
                  <Markdown
                    children={product.longDescription}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
                <div className="divider" />
              </>
            )}

            {product.howToUse && (
              <>
                <h2 className="h3">How to use {product.name}?</h2>
                <div className="rich-text text-start">
                  <Markdown
                    children={product.howToUse}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
                <div className="divider" />
              </>
            )}

            {product.features && (
              <>
                <h2 className="h3">Core features of {product.name}</h2>
                <div className="rich-text text-start">
                  <Markdown
                    children={product.features}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
                <div className="divider" />
              </>
            )}

            {product.useCase && (
              <>
                <h2 className="h3">Use cases of {product.name}</h2>
                <div className="rich-text text-start">
                  <Markdown
                    children={product.useCase}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
                <div className="divider" />
              </>
            )}

            {product.faq && (
              <>
                <h2 className="h3">FAQ of {product.name}</h2>
                <div className="rich-text text-start">
                  <Markdown
                    children={product.faq}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
                <div className="divider" />
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-4"></div>
      </div>
    </div>
  );
}

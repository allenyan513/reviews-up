import { Button, buttonVariants } from '@reviewsup/ui/button';
import { api } from '@/lib/api-client';
import React from 'react';
import { FlowLayoutClientWrapper } from './FlowLayoutClientWrapper';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export async function WallOfLovePage(props: { lang: string; slug: string }) {
  const { lang, slug } = props;

  const product = await api.product.findBySlug(slug);

  if (!product) {
    return null;
  }
  return (
    <div>
      {/*  Header*/}
      <div className="relative h-72 bg-red-400">
        {/*  Nav bar*/}
        {/*<img*/}
        {/*  src={'/img/grid-card.webp'}*/}
        {/*  className="absolute inset-0 w-full h-full object-cover z-0"*/}
        {/*  alt="Background"*/}
        {/*/>*/}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b bg-white z-0"></div>
        {/* Overlay Layer (optional: for dim effect) */}
        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="relative z-20 px-4 md:px-32 text-white">
          <nav className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-4  p-4 ">
              {product.icon && (
                <img
                  className="w-8 h-8 rounded object-cover aspect-video "
                  src={product.icon}
                  alt={product.name}
                />
              )}
              <h1 className="text-sm font-semibold">{product.name}</h1>
            </div>
          </nav>
          <div className="p-4 flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-center">
              Wall of Love for {slug}
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              A place to celebrate and appreciate the community!
            </p>
            <Link
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'lg',
                }),
              )}
              href={`/forms/${product.bindingFormId}`}
            >
              Submit your testimonial
            </Link>
          </div>
        </div>
      </div>

      {/*  Main Content*/}
      <div className="px-4 md:px-32 py-8">
        <FlowLayoutClientWrapper reviews={product.reviews} config={{}} />
      </div>
    </div>
  );
}

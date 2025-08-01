'use client';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import React, { useEffect } from 'react';
import { FlowLayoutClientWrapper } from './FlowLayoutClientWrapper';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { WallOfLoveConfig, WallOfLoveEntity } from '@reviewsup/api/walloflove';
import { useWallOfLoveContext } from '@/modules/wall-of-love/wall-of-love-context';

export function WallOfLovePage(props: { lang: string; className?: string }) {
  const { lang, className } = props;
  const { wallOfLove, setWallOfLove } = useWallOfLoveContext();
  if (!wallOfLove) {
    return null;
  }
  const config = wallOfLove.config as WallOfLoveConfig;
  const { product, reviews } = wallOfLove;
  if (!product) {
    return null;
  }
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="relative h-72 bg-red-400">
        <img
          src={config.backgroundUrl || '/images/wall-of-love-bg.jpg'}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Background"
        />
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
              {config.title}
            </h1>
            <h2 className="text-center text-white dark:text-gray-400">
              {config.subtitle}
            </h2>
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
      <div className="px-4 md:px-32 py-8">
        <FlowLayoutClientWrapper reviews={reviews} config={{}} />
      </div>
    </div>
  );
}

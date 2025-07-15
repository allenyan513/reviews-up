'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  CreateProductRequest,
  createProductSchema,
  ProductEntity,
} from '@reviewsup/api/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductItemView } from '@/modules/promotion/promotion-product-item-view';
import { PromotionNewProductForm } from '@/modules/promotion/promotion-new-product-form';
import { api } from '@/lib/api-client';
import slugify from 'slugify';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@reviewsup/ui/tabs';

export function PromotionNewProduct(props: {
  mode: 'new' | 'edit';
  lang: string;
  workspaceId: string;
  id?: string;
}) {
  const { lang, workspaceId, id, mode } = props;
  const productId = id || '';
  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      workspaceId: workspaceId,
      formId: '',
      formShortId: '',
      widgetId: '',
      widgetShortId: '',
      name: '',
      description: '',
      url: '',
      icon: '',
      screenshot: '',
      longDescription: '',
      features: '',
      useCase: '',
      howToUse: '',
      faq: '',
      category: 'ai',
      submitOption: 'free-submit',
    },
  });

  useEffect(() => {
    if (!productId) {
      return;
    }
    api.product
      .findOne(productId)
      .then((product) => {
        if (product) {
          form.reset({
            workspaceId: product.workspaceId,
            formId: product.formId,
            formShortId: product.formShortId || '',
            widgetId: product.showcaseId,
            widgetShortId: product.showcaseShortId || '',
            name: product.name,
            description: product.description || '',
            url: product.url,
            icon: product.icon || '',
            screenshot: product.screenshot || '',
            longDescription: product.longDescription || '',
            features: product.features || '',
            useCase: product.useCase || '',
            howToUse: product.howToUse || '',
            faq: product.faq || '',
            category: product.category || 'ai',
            submitOption: 'free-submit', // Default value, can be changed later
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [productId]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${workspaceId}/forms`}
            className="flex flex-row items-center gap-2 "
          >
            <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
              {mode === 'new' ? 'Submit Your Product' : 'Edit Your Product'}
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Fill in the details to promote your product.
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}></div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
        <PromotionNewProductForm
          lang={lang}
          workspaceId={workspaceId}
          form={form}
          mode={mode}
          id={productId || ''}
        />
        <div className="md:col-span-4 w-full space-y-2">
          <Tabs defaultValue="product">
            <TabsList>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="widget">Widget</TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <ProductItemView
                product={
                  {
                    id: '',
                    name: form.watch('name'),
                    description: form.watch('description'),
                    url: form.watch('url'),
                    icon: form.watch('icon'),
                    screenshot: form.watch('screenshot'),
                    longDescription: form.watch('longDescription'),
                    features: form.watch('features'),
                    useCase: form.watch('useCase'),
                    howToUse: form.watch('howToUse'),
                    faq: form.watch('faq'),
                    category: form.watch('category'),
                  } as ProductEntity
                }
              />
              <Link
                target="_blank"
                className="text-blue-500 w-full flex flex-row gap-2 items-center mt-4"
                href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${slugify(
                  form.watch('name') || '',
                  { lower: true, strict: true },
                )}`}
              >
                <span>
                  {process.env.NEXT_PUBLIC_WWW_URL}/products/
                  {slugify(form.watch('name') || '', {
                    lower: true,
                    strict: true,
                  })}
                </span>
                <BsBoxArrowUpRight />
              </Link>
            </TabsContent>

            <TabsContent value="form">
              <iframe
                src={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.watch('formShortId')}`}
                className="w-full h-96 border rounded-md"
                title="Form Preview"
              />
              <Link
                target="_blank"
                className="text-blue-500 w-full flex flex-row gap-2 items-center mt-4"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.watch('formShortId')}`}
              >
                <span>
                  {process.env.NEXT_PUBLIC_APP_URL}/forms/
                  {form.watch('formShortId')}
                </span>
                <BsBoxArrowUpRight />
              </Link>
            </TabsContent>
            <TabsContent value="widget">
              <iframe
                src={`${process.env.NEXT_PUBLIC_APP_URL}/showcases/${form.watch('widgetShortId')}`}
                className="w-full h-96 border rounded-md p-4"
                title="Widget Preview"
              />
              <Link
                target="_blank"
                className="text-blue-500 w-full flex flex-row gap-2 items-center mt-4"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/showcases/${form.watch('widgetShortId')}`}
              >
                <span>
                  {process.env.NEXT_PUBLIC_APP_URL}/showcases/
                  {form.watch('widgetShortId')}
                </span>
                <BsBoxArrowUpRight />
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

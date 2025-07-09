'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from '@reviewsup/ui/form';
import {
  CreateProductRequest,
  createProductSchema,
  ProductCategory,
  ProductEntity,
  productSchema,
} from '@reviewsup/api/products';
import slugify from 'slugify';
import { Input } from '@reviewsup/ui/input';
import { Textarea } from '@reviewsup/ui/textarea';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Required } from '@reviewsup/ui/required';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from '@reviewsup/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { FormEntity } from '@reviewsup/api/forms';
import { cn } from '@/lib/utils';
import { BsCaretDownFill } from 'react-icons/bs';
import { UploadContainer } from '@/components/upload-container';
import { BiImage } from 'react-icons/bi';
import { ProductItemView } from '@/modules/promotion/promotion-product-item-view';
import toast from 'react-hot-toast';

export function PromotionNewProduct(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const router = useRouter();

  const [advance, setAdvance] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [forms, setForms] = useState<FormEntity[]>([]);
  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      workspaceId: workspaceId,
      formId: '',
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
    },
  });

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    api.form
      .getForms(workspaceId)
      .then((response) => {
        setForms(response);
      })
      .catch((error) => {
        console.error('Error fetching forms:', error);
      });
  }, [workspaceId, form]);

  const onClickFetchProductInfo = async (url: string) => {
    alert('This feature is under development. Please enter the product details manually.');
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      setLoading(true);
      const response = await api.product.createOne(data);
      toast.success('Product Submitted Successfully!');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      router.push(`/${lang}/${workspaceId}/promotion/my-products`);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

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
              Submit Your Product
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Fill in the details to promote your product.
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}></div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
        <div className="md:col-span-6 flex flex-col border border-gray-200 rounded-md bg-white shadow-md p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <FormField
                control={form.control}
                name="formId"
                render={({ field }) => (
                  <div>
                    <FormLabel className="mb-2">
                      Binding Collection Form <Required />
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center gap-2 mb-2">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a form" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {forms.map((item) => (
                                <SelectItem key={item.id} value={item.id || ''}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <Link
                          href={`/${lang}/${workspaceId}/forms/${form.watch('formId')}/default`}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: 'default' }),
                            // 'disabled:opacity-50 disabled:pointer-events-none',
                            form.watch('formId') === ''
                              ? 'opacity-50 pointer-events-none'
                              : '',
                          )}
                        >
                          Edit
                        </Link>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div>
                    <FormLabel className="mb-2">
                      Product Name <Required />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-2 text-sm text-gray-500">
                      https://reviewsup.io/products/
                      {slugify(field.value || '', {
                        lower: true,
                        strict: true,
                      })}
                    </p>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <div>
                    <FormLabel className="mb-2">
                      Product URL <Required />
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2 items-center">
                        <Input
                          placeholder="https://yourproduct.com"
                          {...field}
                        />
                        <Button
                          onClick={() => {
                            onClickFetchProductInfo(field.value||'');
                          }}
                          disabled={field.value === ''}
                        >
                          Fetch Product Info
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                )}
              />

              <div className="flex flex-col gap-4 ">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <div>
                      <FormLabel className="mb-2">
                        Product Description <Required />
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Short description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <div>
                      <FormLabel className="mb-2">
                        Product Category
                        <Required />
                      </FormLabel>
                      <FormControl>
                        {/*<Select*/}
                        {/*  value={field.value}*/}
                        {/*  onValueChange={field.onChange}*/}
                        {/*>*/}
                        {/*  <SelectContent>*/}
                        {/*    <SelectItem value="software">Software</SelectItem>*/}
                        {/*    <SelectItem value="hardware">Hardware</SelectItem>*/}
                        {/*    <SelectItem value="service">Service</SelectItem>*/}
                        {/*    <SelectItem value="other">Other</SelectItem>*/}
                        {/*  </SelectContent>*/}
                        {/*</Select>*/}
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Product Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.entries(ProductCategory).map(
                                ([key, value]) => (
                                  <SelectItem key={key} value={value}>
                                    {/*capitalize the first letter of each word*/}
                                    {key
                                      .split(/(?=[A-Z])/)
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1).toLowerCase(),
                                      )
                                      .join(' ')}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <div>
                      <FormLabel className="mb-2">
                        Product Icon
                        <Required />
                      </FormLabel>
                      <FormControl>
                        {/*<Input placeholder="https://icon.url" {...field} />*/}
                        <div className="flex flex-row items-center gap-2">
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Product Icon"
                              className="w-11 h-11 rounded border border-gray-300"
                            />
                          )}
                          <UploadContainer
                            accept={'image/*'}
                            onUploadSuccess={(url) => {
                              field.onChange(url);
                            }}
                          >
                            <BiImage className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
                          </UploadContainer>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="screenshot"
                  render={({ field }) => (
                    <div>
                      <FormLabel className="mb-2">
                        Product Screenshot
                        <Required />
                      </FormLabel>
                      <FormControl>
                        {/*<Input*/}
                        {/*  placeholder="https://screenshot.url"*/}
                        {/*  {...field}*/}
                        {/*/>*/}

                        <div className="flex flex-row items-end gap-2">
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Product Icon"
                              className="w-96 h-auto rounded border border-gray-300"
                            />
                          )}
                          <UploadContainer
                            accept={'image/*'}
                            onUploadSuccess={(url) => {
                              field.onChange(url);
                            }}
                          >
                            <BiImage className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
                          </UploadContainer>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  )}
                />

                <h2
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => setAdvance(!advance)}
                >
                  Advance Information{' '}
                  <BsCaretDownFill className="inline-block ml-2" />
                </h2>
                <div className={cn('', advance ? 'flex flex-col gap-4' : 'hidden')}>
                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <div>
                        <FormLabel className='mb-2'>What is it?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="howToUse"
                    render={({ field }) => (
                      <div>
                        <FormLabel className='mb-2'>How to Use?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Instructions (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <div>
                        <FormLabel className='mb-2'>Features</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Key features (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="useCase"
                    render={({ field }) => (
                      <div>
                        <FormLabel className='mb-2'>Use Case</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Use cases (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="faq"
                    render={({ field }) => (
                      <div>
                        <FormLabel className='mb-2'>FAQ</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Frequently asked questions (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    )}
                  />
                </div>
              </div>
              <Button disabled={loading} type="submit" className="w-full mt-4">
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <div className="col-span-3 w-full">
          <h2 className="text-sm text-gray-500 mb-2">Preview</h2>
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
        </div>
      </div>
    </div>
  );
}

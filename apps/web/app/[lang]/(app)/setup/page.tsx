'use client';
import React, { use, useEffect, useState } from 'react';
import { PromotionNewProduct } from '@/modules/promotion/promotion-new-product';
import { ProductAddButton } from '@/modules/product/product-add-button';
import { useForm } from 'react-hook-form';
import {
  CreateProductRequest,
  createProductSchema,
  ProductCategory,
  ProductEntity,
} from '@reviewsup/api/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@reviewsup/ui/form';
import { Required } from '@reviewsup/ui/required';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@reviewsup/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reviewsup/ui/select';
import { UploadContainer } from '@/components/upload-container';
import { BiImage } from 'react-icons/bi';
import { BsBoxArrowUpRight, BsCaretDownFill } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { ProductItemView } from '@/modules/promotion/promotion-product-item-view';
import Link from 'next/link';
import slugify from 'slugify';
import { useUserContext } from '@/context/UserProvider';
import { useRouter } from 'next/navigation';


export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { defaultProduct, setDefaultProduct } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [advance, setAdvance] = useState<boolean>(false);

  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      icon: '',
      screenshot: '',
      category: 'ai',
      longDescription: '',
      features: '',
      useCase: '',
      howToUse: '',
      faq: '',
    },
  });

  const handleCrawlProductInfo = async () => {
    try {
      const url = form.getValues('url');
      setIsCrawling(true);
      const response = await api.product.crawlOne(url || '');
      const { title, description, faviconUrl, screenshotUrl } = response;
      form.setValue('name', title);
      form.setValue('description', description);
      form.setValue('icon', faviconUrl);
      form.setValue('screenshot', screenshotUrl);
      setIsCrawling(false);
    } catch (error) {
      setIsCrawling(false);
      toast.error('Failed to fetch product info. Please try again.');
    }
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      console.log('Submitting product data:', data);
      setLoading(true);
      const newProduct = await api.product.setup(data);
      setDefaultProduct(newProduct);
      setLoading(false);
      toast.success('Product Submitted Successfully!');
      router.push(
        `${newProduct.id}/reviews/all`,
      );
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };
  return (
    <div className="min-h-screen p-6 md:p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Create New Product
          </h1>
          <p className="mt-1 text-gray-600">
            Fill out the form below to create your first product. You can also
            auto-fill the product information by providing a product URL.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (form.getValues('submitOption') === 'crawl-product-info') {
                  handleCrawlProductInfo();
                } else {
                  form.handleSubmit(onSubmit)();
                }
              }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold">
                Basic Information <Required />
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
                              form.setValue(
                                'submitOption',
                                'crawl-product-info',
                              );
                            }}
                            disabled={field.value === '' || isCrawling}
                          >
                            {isCrawling ? 'Loading...' : 'Auto-fill'}
                          </Button>
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
                    </div>
                  )}
                />
              </div>
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <h2
                className="text-lg font-semibold cursor-pointer mt-8"
                onClick={() => setAdvance(!advance)}
              >
                Advance Information (optional)
                <BsCaretDownFill className="inline-block ml-2" />
              </h2>
              <div
                className={cn('', advance ? 'flex flex-col gap-4' : 'hidden')}
              >
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <div>
                      <FormLabel className="mb-2">What is it?</FormLabel>
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
                      <FormLabel className="mb-2">How to Use?</FormLabel>
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
                      <FormLabel className="mb-2">Features</FormLabel>
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
                      <FormLabel className="mb-2">Use Case</FormLabel>
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
                      <FormLabel className="mb-2">FAQ</FormLabel>
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
              <Button
                disabled={loading}
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
                size={'lg'}
              >
                Create Product
              </Button>
            </form>
          </Form>
        </div>
        <div className="col-span-4 space-y-4">
          <h2 className="text-sm text-gray-500">Preview</h2>
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
        </div>
      </div>
    </div>
  );
}

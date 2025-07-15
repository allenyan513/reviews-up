'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@reviewsup/ui/form';
import { LoadingText } from '@reviewsup/ui/loading-text';
import { CreateProductRequest, ProductCategory } from '@reviewsup/api/products';
import { Input } from '@reviewsup/ui/input';
import { Textarea } from '@reviewsup/ui/textarea';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { Required } from '@reviewsup/ui/required';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectGroup,
} from '@reviewsup/ui/select';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { FormEntity } from '@reviewsup/api/forms';
import { cn } from '@/lib/utils';
import { BsCaretDownFill, BsPlus } from 'react-icons/bs';
import { UploadContainer } from '@/components/upload-container';
import { BiCodeAlt, BiImage } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';
import { useUserContext } from '@/context/UserProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ShowcaseEntity } from '@reviewsup/api/showcases';
import { ShowcaseEmbedDialog } from '@/modules/showcase/showcase-embed-dialog';
import { useVerifyEmbed } from '@/hooks/use-verify-embed';

export function PromotionNewProductForm(props: {
  lang: string;
  workspaceId: string;
  form: UseFormReturn;
  mode: 'new' | 'edit';
  id?: string;
}) {
  const { lang, workspaceId, form, mode, id } = props;
  const productId = id || '';
  const router = useRouter();

  const { user } = useUserContext();
  const [advance, setAdvance] = useState<boolean>(mode === 'edit' || false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [forms, setForms] = useState<FormEntity[]>([]);
  const [widgets, setWidgets] = useState<ShowcaseEntity[]>([]);
  const [formsLoaded, setFormsLoaded] = useState(false); // New state to track if forms are loaded
  const [widgetsLoaded, setWidgetsLoaded] = useState(false); // New state to track if widgets are loaded
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [taskReviewCount, setTaskReviewCount] = useState<number>(0);
  const { loading: verifyLoading, verify } = useVerifyEmbed(
    form.watch('url'),
    form.watch('widgetShortId') || '',
  );

  const handleCrawlProductInfo = async () => {
    try {
      const url = form.getValues('url');
      setIsCrawling(true);
      const response = await api.product.crawlOne(url);
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = form.getValues();
      const response = await api.product.updateOne(productId, {
        ...values,
      }); // 你需要实现这个API
      toast.success('Product updated successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Failed to update product. Please try again.');
    }
  };

  const onSubmit = async (data: CreateProductRequest) => {
    try {
      console.log('Submitting product data:', data);
      setLoading(true);
      const response = await api.product.createOne(data);
      if (response.code === 600) {
        const data = response.data as CreateOneTimePaymentResponse;
        const { sessionUrl } = data;
        setLoading(false);
        setIsCheckDialogOpen(true);
        window.open(sessionUrl, '_blank');
      } else if (response.code === 400) {
        setLoading(false);
        const message = response.message;
        toast.error(message || 'Failed to submit product. Please try again.');
      } else {
        setLoading(false);
        toast.success('Product Submitted Successfully!');
        router.push(`/${lang}/${workspaceId}/promotion/my-products`);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    api.form
      .getForms(workspaceId)
      .then((response) => {
        setForms(response);
        setFormsLoaded(true);
        const newMode = mode === 'new';
        const formId = form.getValues('formId');
        if (!formId && !newMode) {
          return;
        }
        if (response && response.length > 0) {
          //find first item.isBindProduct is false
          const firstAvailableForm = response.find(
            (item) => !item.isBindProduct,
          );
          if (!firstAvailableForm) {
            return;
          }
          form.setValue('formId', firstAvailableForm.id || '');
          form.setValue('formShortId', firstAvailableForm.shortId || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching forms:', error);
        setFormsLoaded(true);
      });
    api.showcase
      .getShowcases(workspaceId)
      .then((response) => {
        const widgets = response.items;
        setWidgets(widgets);
        setWidgetsLoaded(true);
        const newMode = mode === 'new';
        const widgetId = form.getValues('widgetId');
        if (!widgetId && !newMode) {
          return;
        }
        if (widgets && widgets.length > 0) {
          const firstAvailableWidget = widgets.find(
            (item) => !item.isBindProduct,
          );
          if (!firstAvailableWidget) {
            return;
          }
          form.setValue('widgetId', firstAvailableWidget.id || '');
          form.setValue('widgetShortId', firstAvailableWidget.shortId || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching showcases:', error);
      });

    api.product
      .taskReviewCount()
      .then((response) => {
        setTaskReviewCount(response.data);
      })
      .catch((error) => {
        setTaskReviewCount(10);
      });
  }, [workspaceId, form, mode]);

  return (
    <div className="md:col-span-8 flex flex-col">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.getValues('submitOption') === 'crawl-product-info') {
              handleCrawlProductInfo();
            } else if (form.getValues('submitOption') === 'update') {
              handleUpdate();
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
                        disabled={props.mode === 'edit'}
                        placeholder="https://yourproduct.com"
                        {...field}
                      />
                      <Button
                        onClick={() => {
                          form.setValue('submitOption', 'crawl-product-info');
                        }}
                        disabled={
                          field.value === '' ||
                          isCrawling ||
                          props.mode === 'edit'
                        }
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
                    <Input
                      disabled={props.mode === 'edit'}
                      placeholder="Product Name"
                      {...field}
                    />
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Product Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(ProductCategory).map(([key, value]) => (
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
                        ))}
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

          <h2 className="text-lg font-semibold mt-8">
            Form and Widget Information <Required />
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="formId"
              render={({ field }) => (
                <div>
                  <FormLabel className="mb-2">
                    Form <Required />
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-2 mb-2">
                      {formsLoaded ? (
                        <Select
                          disabled={props.mode === 'edit'}
                          value={field.value}
                          onValueChange={(selectedId) => {
                            const selectedForm = forms.find(
                              (item) => item.id === selectedId,
                            );
                            if (selectedForm) {
                              form.setValue('formId', selectedForm.id || '');
                              form.setValue(
                                'formShortId',
                                selectedForm.shortId || '',
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a form" />
                          </SelectTrigger>
                          <SelectContent>
                            <Link
                              target="_blank"
                              href={`/${workspaceId}/forms`}
                              className="flex flex-row items-center gap-1 text-sm h-8 cursor-pointer"
                            >
                              <BsPlus />
                              Create a New Form
                            </Link>
                            <SelectGroup>
                              {forms.map((item) => (
                                <SelectItem
                                  disabled={item.isBindProduct}
                                  key={item.id}
                                  value={item.id || ''}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          disabled
                          placeholder="Loading forms..."
                          className="w-full"
                        />
                      )}
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
              name="widgetId"
              render={({ field }) => (
                <div>
                  <FormLabel className="mb-2">
                    Widget <Required />
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-row items-center gap-2 mb-2">
                      {widgetsLoaded ? (
                        <Select
                          disabled={props.mode === 'edit'}
                          value={field.value}
                          onValueChange={(selectedId) => {
                            const selectedWidget = widgets.find(
                              (item) => item.id === selectedId,
                            );
                            if (selectedWidget) {
                              form.setValue(
                                'widgetId',
                                selectedWidget.id || '',
                              );
                              form.setValue(
                                'widgetShortId',
                                selectedWidget.shortId || '',
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Widget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <Link
                                target="_blank"
                                href={`/${workspaceId}/showcases`}
                                className="flex flex-row items-center gap-1 text-sm h-8 cursor-pointer"
                              >
                                <BsPlus />
                                Create a New Widget
                              </Link>
                              {widgets.map((item) => (
                                <SelectItem
                                  disabled={item.isBindProduct}
                                  key={item.id}
                                  value={item.id || ''}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          disabled
                          placeholder="Loading widgets..."
                          className="w-full"
                        />
                      )}
                      <Link
                        href={`/${lang}/${workspaceId}/showcases/${form.watch('widgetId')}`}
                        target="_blank"
                        className={cn(
                          buttonVariants({ variant: 'default' }),
                          // 'disabled:opacity-50 disabled:pointer-events-none',
                          form.watch('widgetId') === ''
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
          </div>

          <h2
            className="text-lg font-semibold cursor-pointer mt-8"
            onClick={() => setAdvance(!advance)}
          >
            Advance Information (optional)
            <BsCaretDownFill className="inline-block ml-2" />
          </h2>
          <div className={cn('', advance ? 'flex flex-col gap-4' : 'hidden')}>
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
                    <Textarea placeholder="Use cases (optional)" {...field} />
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
          <div
            className={cn(
              'flex flex-row items-center justify-between mb-4 mt-8',
              mode === 'edit' ? 'hidden' : '',
            )}
          >
            <h2 className="text-lg font-semibold">Submit Options</h2>
          </div>

          {/* Update Button */}
          <Button
            variant="default"
            size="lg"
            onClick={() => {
              form.setValue('submitOption', 'update');
            }}
            className={cn(
              'flex items-center mt-8',
              mode === 'edit' ? '' : 'hidden',
            )}
          >
            Update
          </Button>

          <div
            className={cn(
              'grid grid-cols-1 md:grid-cols-2 gap-4',
              mode === 'edit' ? 'hidden' : '',
            )}
          >
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
              <h3 className="text-xl font-semibold">Free Submit</h3>
              <h4 className="text-sm text-gray-500 ml-2">
                No cost, requires following steps
              </h4>
              <ul className="text-start list-disc pl-4 mt-4">
                <li>
                  Write at least
                  <span className="text-red-500 font-bold px-1">
                    {taskReviewCount}
                  </span>
                  reviews or testimonials for other products which listing in
                  <Link
                    href={`/${lang}/${workspaceId}/promotion/pending-listings`}
                    className="text-blue-500 hover:underline px-1"
                  >
                    pending
                  </Link>
                  or
                  <Link
                    href={`/${lang}/${workspaceId}/promotion/public-listings`}
                    className="text-blue-500 hover:underline px-1"
                  >
                    public
                  </Link>
                </li>
                <li className="">
                  <span>(Optional) </span>
                  <ShowcaseEmbedDialog
                    showcaseShortId={form.watch('widgetShortId') || ''}
                  >
                    <span className="text-blue-500 hover:underline cursor-pointer">
                      Embed reviewing widget{' '}
                    </span>
                  </ShowcaseEmbedDialog>
                  on
                  <Link
                    href={form.watch('url')}
                    target="_blank"
                    className="text-blue-500 hover:underline px-1"
                  >
                    your website
                  </Link>
                  and
                  <span
                    className="text-blue-500 hover:underline cursor-pointer px-1"
                    onClick={verify}
                  >
                    {verifyLoading ? 'Verifying...' : 'Verify'}
                  </span>
                  {/*<VerifyWidgetEmbedding*/}
                  {/*  url={form.watch('url')}*/}
                  {/*  showcaseShortId={form.watch('widgetShortId')}*/}
                  {/*>*/}
                  {/*  Verify*/}
                  {/*</VerifyWidgetEmbedding>*/}
                </li>
              </ul>
              <Button
                disabled={loading}
                variant="outline"
                size="lg"
                type="submit"
                className="w-full mt-4"
                onClick={() => {
                  form.setValue('submitOption', 'free-submit');
                }}
              >
                {loading ? (
                  <LoadingText>Submitting...</LoadingText>
                ) : (
                  'Submit for Free'
                )}
              </Button>
            </div>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
              <h3 className="text-xl font-semibold">Paid Submit</h3>
              <h4 className="text-sm text-gray-500 ml-2">
                Instant listing with premium perks
              </h4>
              <ul className={'text-start list-disc pl-4 mt-4'}>
                <li>Get listed immediately—no reviews required</li>
                <li>Your product appears at the top of the listing page</li>
                <li>Receive a “Featured” badge</li>
              </ul>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={loading} size="lg" className="w-full mt-4">
                    Submit for $9.9
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to submit your product for a one-time fee of
                      <span className="text-red-500"> $9.9</span>. This will
                      allow your product to be listed immediately without the
                      need for reviews.
                      <br />
                      <br />
                      Please ensure that all information is correct before
                      proceeding.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      onClick={() => {
                        form.setValue('submitOption', 'paid-submit');
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog
                open={isCheckDialogOpen}
                onOpenChange={setIsCheckDialogOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {/*支付成功了吗？*/}
                      Do you have a successful payment?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                      {/*充值成功后，点击“继续”按钮以完成产品提交。*/}
                      After successful payment, click the "Continue" button to
                      complete the product submission.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      type="submit"
                      onClick={() => {
                        form.setValue('submitOption', 'paid-submit');
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-sm text-gray-500 mt-2">
                Current Balance: ${user?.balance || 0}
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

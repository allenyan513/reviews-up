'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import {
  CreateProductRequest,
  createProductSchema,
  ProductEntity,
} from '@reviewsup/api/products';
import { api } from '@/lib/api-client';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserContext } from '@/context/UserProvider';
import { FormEntity } from '@reviewsup/api/forms';
import { useVerifyEmbed } from '@/hooks/use-verify-embed';
import toast from 'react-hot-toast';
import { CreateOneTimePaymentResponse } from '@reviewsup/api/orders';
import { Form, FormControl, FormField, FormMessage } from '@reviewsup/ui/form';
import { Required } from '@reviewsup/ui/required';
import { Input } from '@reviewsup/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reviewsup/ui/select';
import { cn } from '@/lib/utils';
import { WidgetEmbedDialog } from '@/modules/widget/widget-embed-dialog';
import { LoadingText } from '@reviewsup/ui/loading-text';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@reviewsup/ui/tabs';
import { ProductItemView } from '@/modules/product/product-item-view';
import slugify from 'slugify';

function PaidSubmitOption(props: {
  form: any;
  loading: boolean;
  onSubmit: (data: CreateProductRequest) => void;
  isCheckDialogOpen: boolean;
  setIsCheckDialogOpen: (open: boolean) => void;
  currentBalance: string;
}) {
  const {
    form,
    loading,
    onSubmit,
    isCheckDialogOpen,
    setIsCheckDialogOpen,
    currentBalance,
  } = props;
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
      <h3 className="text-xl font-semibold">Paid Upgrade</h3>
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
            Upgrade for $9.9
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit your product for a one-time fee of
              <span className="text-red-500"> $9.9</span>. This will allow your
              product to be listed immediately without the need for reviews.
              <br />
              <br />
              Please ensure that all information is correct before proceeding.
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

      <AlertDialog open={isCheckDialogOpen} onOpenChange={setIsCheckDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {/*支付成功了吗？*/}
              Do you have a successful payment?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {/*充值成功后，点击“继续”按钮以完成产品提交。*/}
              After successful payment, click the "Continue" button to complete
              the product submission.
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
        {/*Current Balance: ${user?.balance?.toString() || 0}*/}
        Current Balance: ${currentBalance}
      </p>
    </div>
  );
}

function VerifySubmitOption(props: { form: any; loading: boolean }) {
  const { form, loading } = props;
  const { loading: verifyLoading, verify } = useVerifyEmbed(
    form.watch('url') || '',
  );
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
      <h3 className="text-xl font-semibold">Verify and Upgrade</h3>
      <h4 className="text-sm text-gray-500 ml-2">
        No cost, but requires widget embedding
      </h4>
      <ul className="text-start list-disc pl-4 mt-4">
        <li>
          <WidgetEmbedDialog widgetShortId={''}>
            <span className="text-blue-500 hover:underline cursor-pointer">
              Embed{' '}
            </span>
          </WidgetEmbedDialog>
          any widget on
          <Link
            href={form.watch('url') || '#'}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {' '}
            your website{' '}
          </Link>
          . It just costs a few minutes to set up.
        </li>
        <li>
          <Button variant={'outline'} size={'sm'} onClick={verify}>
            {verifyLoading ? 'Verifying...' : 'Verify'}
          </Button>{' '}
          and submit it, your product will be{' '}
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/products`}
            className="text-blue-500 hover:underline"
          >
            Public
          </Link>
        </li>
      </ul>
      <Button
        disabled={loading}
        variant="outline"
        size="lg"
        type="submit"
        className="w-full mt-4"
        onClick={() => {
          form.setValue('submitOption', 'verify-submit');
        }}
      >
        {loading ? (
          <LoadingText>Submitting...</LoadingText>
        ) : (
          'Verify and Upgrade'
        )}
      </Button>
    </div>
  );
}

function FreeSubmitOption(props: {
  form: any;
  loading: boolean;
  taskReviewCount: number;
}) {
  const { form, loading, taskReviewCount } = props;
  return (
    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 text-center">
      <h3 className="text-xl font-semibold">Free Submit</h3>
      <h4 className="text-sm text-gray-500 ml-2">
        No cost, complete tasks to get listed
      </h4>
      <ul className="text-start list-disc pl-4 mt-4">
        <li>
          Write at least
          <span className="text-red-500 font-bold px-1">{taskReviewCount}</span>
          reviews or testimonials for other products which listing in
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/pending`}
            className="text-blue-500 hover:underline px-1"
          >
            Pending
          </Link>
          or
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/products`}
            className="text-blue-500 hover:underline px-1"
          >
            Public
          </Link>
          after you submit your product.
        </li>
        <li>
          After completing the tasks, your product will be{' '}
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_WWW_URL}/products`}
            className="text-blue-500 hover:underline"
          >
            Public
          </Link>
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
        {loading ? <LoadingText>Submitting...</LoadingText> : 'Submit for Free'}
      </Button>
    </div>
  );
}

function LaunchSubmitOrEditPreview(props: {
  product: ProductEntity;
  bindingFormId: string;
}) {
  const { product, bindingFormId } = props;
  return (
    <Tabs defaultValue="product">
      <TabsList>
        <TabsTrigger value="product">Product</TabsTrigger>
        <TabsTrigger value="form">Form</TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <ProductItemView product={product} />
        <Link
          target="_blank"
          className="text-blue-500 w-full flex flex-row gap-2 items-center mt-4"
          href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${product.slug}`}
        >
          <span>
            {process.env.NEXT_PUBLIC_WWW_URL}/products/{product.slug}
          </span>
          <BsBoxArrowUpRight />
        </Link>
      </TabsContent>
      <TabsContent value="form">
        <iframe
          src={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${bindingFormId}`}
          className="w-full h-96 border rounded-md"
          title="Form Preview"
        />
        <Link
          target="_blank"
          className="text-blue-500 w-full flex flex-row gap-2 items-center mt-4"
          href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${bindingFormId}`}
        >
          <span>
            {process.env.NEXT_PUBLIC_APP_URL}/forms/{bindingFormId}
          </span>
          <BsBoxArrowUpRight />
        </Link>
      </TabsContent>
    </Tabs>
  );
}

export function LaunchSubmitOrEditPage(props: {
  lang: string;
  productId: string;
  mode: 'new' | 'edit';
}) {
  const { lang, productId, mode } = props;
  const { defaultProduct } = useUserContext();

  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      id: defaultProduct?.id || '',
      name: defaultProduct?.name || '',
      slug: defaultProduct?.slug || '',
      description: defaultProduct?.description || '',
      url: defaultProduct?.url || '',
      icon: defaultProduct?.icon || '',
      screenshot: defaultProduct?.screenshot || '',
      bindingFormId: defaultProduct?.bindingFormId || '',
      submitOption: 'free-submit',
    },
  });

  const router = useRouter();
  const { user, syncSession } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [forms, setForms] = useState<FormEntity[]>([]);
  const [formsLoaded, setFormsLoaded] = useState(false); // New state to track if forms are loaded
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [taskReviewCount, setTaskReviewCount] = useState<number>(0);

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
      setLoading(true);
      const response = await api.product.submit(data);
      if (response.code === 200) {
        setLoading(false);
        toast.success('Product Submitted Successfully!');
        await syncSession();
        router.push(`/${lang}/${productId}/launch`);
      } else if (response.code === 600) {
        const data = response.data as CreateOneTimePaymentResponse;
        const { sessionUrl } = data;
        setLoading(false);
        setIsCheckDialogOpen(true);
        window.open(sessionUrl, '_blank');
      } else {
        setLoading(false);
        const message = response.message;
        toast.error(message || 'Failed to submit product. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

  useEffect(() => {
    if (!productId) {
      return;
    }
    api.product
      .findOne(productId)
      .then((product) => {
        if (product) {
          form.reset({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            url: product.url,
            icon: product.icon || '',
            screenshot: product.screenshot || '',
            bindingFormId: product.bindingFormId || '',
            submitOption: 'free-submit', // Default value, can be changed later
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });

    api.form
      .getForms(productId)
      .then((response) => {
        setForms(response);
        setFormsLoaded(true);
        const newMode = mode === 'new';
        const formId = form.getValues('bindingFormId');
        if (!formId && !newMode) {
          return;
        }
        if (response && response.length > 0) {
          //find first item.isBindProduct is false
          const firstForm = response[0];
          form.setValue('bindingFormId', firstForm?.id || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching forms:', error);
        setFormsLoaded(true);
      });

    api.product
      .taskReviewCount()
      .then((response) => {
        setTaskReviewCount(response.data);
      })
      .catch((error) => {
        setTaskReviewCount(10);
      });
  }, [productId, form, mode]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
            Upgrade My Product
          </h1>
          <p className="mt-1 text-gray-600 hidden md:flex">
            {/*绑定一个表单，并且从提交选择中选择一个，可以是免费提交，验证提交，或者付费提交，*/}
            Bind a form to your product and select a submission option.
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}></div>
      </div>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.getValues('submitOption') === 'update') {
              handleUpdate();
            } else {
              form.handleSubmit(onSubmit)();
            }
          }}
          className="space-y-4"
        >
          <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
            <div className="col-span-9 flex flex-col">
              <h2 className="text-lg font-semibold mb-0">
                Binding Form <Required />
              </h2>
              <h3 className="text-sm text-gray-500 mb-2">
                Select a form to bind with your product. This form will be used
                to collect reviews and testimonials from users.
              </h3>
              <FormField
                control={form.control}
                name="bindingFormId"
                render={({ field }) => (
                  <div>
                    <FormControl>
                      <div className="flex flex-row items-center gap-2 mb-2">
                        {formsLoaded ? (
                          <Select
                            value={field.value}
                            onValueChange={(selectedId) => {
                              const selectedForm = forms.find(
                                (item) => item.id === selectedId,
                              );
                              if (selectedForm) {
                                form.setValue(
                                  'bindingFormId',
                                  selectedForm.id || '',
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a form" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {forms.map((item) => (
                                  <SelectItem
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
                          href={`/${lang}/${productId}/forms/${form.watch('bindingFormId')}/default`}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: 'default' }),
                            form.watch('bindingFormId') === ''
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
              <div>
                <div className="flex flex-row items-center justify-between mb-4 mt-8">
                  <h2 className="text-lg font-semibold">Upgrade Options</h2>
                </div>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                  <VerifySubmitOption form={form} loading={loading} />
                  <PaidSubmitOption
                    form={form}
                    loading={loading}
                    onSubmit={onSubmit}
                    isCheckDialogOpen={isCheckDialogOpen}
                    setIsCheckDialogOpen={setIsCheckDialogOpen}
                    currentBalance={user?.balance?.toString() || '0'}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <LaunchSubmitOrEditPreview
                product={
                  {
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
                    slug: slugify(form.watch('name') || '', {
                      lower: true,
                      strict: true,
                    }),
                  } as ProductEntity
                }
                bindingFormId={form.watch('bindingFormId') || ''}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

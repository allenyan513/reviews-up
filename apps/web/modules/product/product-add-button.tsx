import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
} from '@reviewsup/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Required } from '@reviewsup/ui/required';
import { Textarea } from '@reviewsup/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@reviewsup/ui/select';
import {
  CreateProductRequest,
  createProductSchema,
  ProductCategory,
} from '@reviewsup/api/products';
import { UploadContainer } from '@/components/upload-container';
import { BiImage } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 *
 * @param props
 * @constructor
 */
export function ProductAddButton(props: {}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCrawling, setIsCrawling] = useState<boolean>(false);

  const form = useForm<CreateProductRequest>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      icon: '',
      screenshot: '',
      category: 'ai',
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
      const response = await api.product.setup(data);
      setLoading(false);
      toast.success('Product Submitted Successfully!');
    } catch (error) {
      setLoading(false);
      toast.error('Failed to submit product. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <p className="text-sm mt-4 cursor-pointer">
          + <span className="underline">Creat a new Product</span>
        </p>
      </DialogTrigger>
      <DialogContent className="md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
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
                            form.setValue('submitOption', 'crawl-product-info');
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
          </form>
        </Form>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
            className="ml-2"
          >
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

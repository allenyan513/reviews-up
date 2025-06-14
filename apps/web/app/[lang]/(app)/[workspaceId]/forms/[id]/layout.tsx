'use client';

import { useEffect, useState, use } from 'react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave } from 'react-icons/bi';
import { BsHeart, BsStar } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BsBoxArrowUpRight, BsCodeSlash, BsShare } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { CopyCodeDialog } from '@/components/copy-code-dialog';

const pageItems = [
  {
    title: 'Form Page',
    url: 'default',
    icon: BsStar,
  },
  {
    title: 'Thanks Page',
    url: 'thanks',
    icon: BsHeart,
  },
];

export default function Layout(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang, workspaceId, id } = use(props.params);
  const path = usePathname();
  const { fetchForm, form } = useFormContext();

  useEffect(() => {
    if (!id) return;
    fetchForm(id);
  }, []);

  if (!form) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${workspaceId}/forms`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-3xl font-semibold text-gray-900">
              Edit {form.name}
            </h1>
          </Link>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <div className={'space-x-2'}>
          <CopyCodeDialog
            title={'Embed your form'}
            codes={[
              `<div id="reviewsup-form-${form.shortId}"></div>`,
              `<script id="revewsup-embed-js" type="text/javascript"`,
              `src="${process.env.NEXT_PUBLIC_APP_URL}/js/embed.js" defer></script>`,
            ]}
          >
            <Button variant="outline" size={'lg'}>
              <BiCodeAlt className="text-2xl" />
              Add to your website
            </Button>
          </CopyCodeDialog>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/forms/${form.shortId}`,
              );
              toast.success('Link copied to clipboard!');
            }}
            variant="outline"
            size={'lg'}
          >
            <BsShare className="text-2xl" />
            Share
          </Button>
          <Button
            onClick={() => {
              window.open(`/forms/${form.shortId}`, '_blank');
            }}
            variant="default"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            Open
          </Button>

        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 flex flex-col">
          <h2 className="mb-4 uppercase">Pages</h2>
          {pageItems.map((item) => (
            <Link
              key={item.title}
              href={`/${lang}/${workspaceId}/forms/${id}/${item.url}`}
              className={cn(
                'cursor-pointer flex flex-row gap-2 w-full items-center justify-start h-12 rounded px-4 font-semibold',
                path.includes(item.url)
                  ? 'bg-red-100 text-red-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.icon && <item.icon />}
              <span className={'text-[14px]'}>{item.title}</span>
            </Link>
          ))}
        </div>
        <div className="col-span-10">{props.children}</div>
      </div>
    </div>
  );
}

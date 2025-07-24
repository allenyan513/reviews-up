'use client';

import { useEffect, useState, use } from 'react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave } from 'react-icons/bi';
import {
  BsHeart,
  BsMailbox,
  BsMailbox2,
  BsMailboxFlag,
  BsSend,
  BsCopy,
  BsStar,
} from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BsBoxArrowUpRight, BsCodeSlash, BsShare } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useFormContext } from '@/modules/form/context/FormProvider';

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

export default function FormIdLayout(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang, productId, id } = use(props.params);
  const path = usePathname();
  const { fetchForm, form } = useFormContext();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetchForm(id);
  }, []);

  if (!form) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${productId}/forms`}
            className="flex flex-row items-center gap-2 "
          >
            {/*<BiArrowBack className="text-2xl" />*/}
            <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
              {/*Edit {form.name}*/}
              Collecting Form
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}>
          {/*<Button*/}
          {/*  onClick={() => {*/}
          {/*    router.push(*/}
          {/*      `/${lang}/${productId}/campaigns/create?formId=${form.id}`,*/}
          {/*    );*/}
          {/*  }}*/}
          {/*  variant="outline"*/}
          {/*  size={'lg'}*/}
          {/*>*/}
          {/*  <BsSend className="text-2xl" />*/}
          {/*  <span className="hidden md:inline">Invite Reviews</span>*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  onClick={() => {*/}
          {/*    navigator.clipboard.writeText(*/}
          {/*      `${window.location.origin}/forms/${form.shortId}`,*/}
          {/*    );*/}
          {/*    toast.success('Link copied to clipboard!');*/}
          {/*  }}*/}
          {/*  variant="outline"*/}
          {/*  size={'lg'}*/}
          {/*>*/}
          {/*  <BsShare className="text-2xl" />*/}
          {/*  <span className="hidden md:inline">Share</span>*/}
          {/*</Button>*/}
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
            <BsCopy className="text-2xl" />
            <span className="hidden md:inline">Copy Link</span>
          </Button>
          <Button
            onClick={() => {
              //todo
            }}
            variant="outline"
            size={'lg'}
          >
            <BsCodeSlash className="text-2xl" />
            <span className="hidden md:inline">Embed Page</span>
          </Button>
          <Button
            onClick={() => {
              window.open(`/forms/${form.shortId}`, '_blank');
            }}
            variant="default"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            <span className="hidden md:inline">Preview</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {pageItems.map((item) => (
            <Link
              key={item.title}
              href={`/${lang}/${productId}/forms/${id}/${item.url}`}
              className={cn(
                'cursor-pointer flex flex-row gap-2 items-center justify-start h-12 rounded px-4 font-semibold border',
                path.includes(item.url)
                  ? 'bg-red-100 text-red-400  border-red-300'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground border-gray-300',
              )}
            >
              {item.icon && <item.icon />}
              <span className={'text-[14px]'}>{item.title}</span>
            </Link>
          ))}
        </div>
        <div className="">{props.children}</div>
      </div>
    </div>
  );
}

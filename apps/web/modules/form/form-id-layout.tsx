'use client';

import { useEffect, useState, use } from 'react';
import { BsHeart, BsCopy, BsStar } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { BsBoxArrowUpRight, BsCodeSlash, BsShare } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

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

  useEffect(() => {
    if (!id) return;
    fetchForm(id);
  }, []);

  if (!form) return null;

  return (
    <DashboardRoot>
      <DashboardHeader
        title="Collecting Form"
        subtitle="Easily collect testimonials from your customers using a simple link"
        url={`/${lang}/dashboard/${productId}/forms`}
        enableBack={false}
        buttons={
          <>
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
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {pageItems.map((item) => (
            <Link
              key={item.title}
              href={`/dashboard/${productId}/forms/${id}/${item.url}`}
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
    </DashboardRoot>
  );
}

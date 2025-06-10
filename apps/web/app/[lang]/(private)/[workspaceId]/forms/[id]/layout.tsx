'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BiArrowBack, BiPlus, BiSave } from 'react-icons/bi';
import { BsHeart, BsStar } from 'react-icons/bs';
import { api } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { BsBoxArrowUpRight, BsCodeSlash, BsShare } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface PageParams {
  lang: string;
  workspaceId: string;
  id: string;
}

const pageItems = [
  {
    title: 'Default Page',
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
  params: Promise<PageParams>;
  children: React.ReactNode;
}) {
  const session = useSession({
    required: true,
  });
  const [params, setParams] = useState<PageParams>();
  const [form, setForm] = useState<FormEntity>();
  const path = usePathname()

  useEffect(() => {
    props.params.then(setParams);
  }, []);

  useEffect(() => {
    if (!session.data || !params) return;
    api
      .getForm(params.id, {
        session: session.data,
      })
      .then((response) => {
        setForm(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session, params]);

  if (!form || !params) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${params.lang}/${params.workspaceId}/forms`}
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
          <Button variant="outline" size={'lg'}>
            <BsCodeSlash className="text-2xl" />
            Add to your website
          </Button>
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
            variant="outline"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            View
          </Button>
          {/*<Button size={'lg'}>*/}
          {/*  <BiSave className="text-2xl" />*/}
          {/*  Save*/}
          {/*</Button>*/}
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-48 flex flex-col">
          <h2 className='mb-4 uppercase'>Pages</h2>
          {pageItems.map((item) => (
            <Link
              key={item.title}
              href={`/${params.lang}/${params.workspaceId}/forms/${params.id}/${item.url}`}
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
        <div className="w-full">
          {props.children}
        </div>
      </div>
    </div>
  );
}

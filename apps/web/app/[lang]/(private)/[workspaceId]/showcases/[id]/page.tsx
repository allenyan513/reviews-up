'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BiArrowBack, BiPlus, BiSave } from 'react-icons/bi';
import { api } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import GridLayout from '@/components/layout/grid-layout';
import ListLayout from '@/components/layout/list-layout';
import { ReviewItem } from '@/components/layout/review-item';
import MarqueeLayout from '@/components/layout/marquee-layout';
import FlowLayout from '@/components/layout/flow-layout';
import { BsBoxArrowUpRight, BsCodeSlash } from 'react-icons/bs';

interface PageParams {
  lang: string;
  workspaceId: string;
  id: string;
}

const layoutOptions = [
  { value: 'list', label: 'ListLayout' },
  { value: 'marquee', label: 'MarqueeLayout' },
  { value: 'grid', label: 'GridLayout' },
  { value: 'flow', label: 'FlowLayout' },
];

export default function Page(props: { params: Promise<PageParams> }) {
  const session = useSession({
    required: true,
  });
  const [showcase, setShowcase] = useState<ShowcaseEntity>();
  const [params, setParams] = useState<PageParams>();
  const [layout, setLayout] = useState('list');

  useEffect(() => {
    props.params.then(setParams);
  }, []);

  useEffect(() => {
    if (!session.data || !params) return;
    api
      .getShowcase(params.id, {
        session: session.data,
      })
      .then((response) => {
        setShowcase(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session, params]);

  if (!params || !showcase || !showcase.reviews) return null;

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href={`/${params.lang}/${params.workspaceId}/showcases`}
            className="flex flex-row items-center gap-2 "
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-3xl font-semibold text-gray-900">
              Edit {showcase.name}
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
              window.open(`/showcases/${showcase.shortId}`, '_blank');
            }}
            variant="outline"
            size={'lg'}
          >
            <BsBoxArrowUpRight className="text-2xl" />
            View
          </Button>
          <Button size={'lg'}>
            <BiSave className="text-2xl" />
            Save
          </Button>
        </div>
      </div>

      <div>
        {/*新增一个Select option */}
        <div className="mb-4 w-60">
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              {layoutOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="bg-gray-50 p-8 border rounded shadow">
          {layout === 'list' && (
            <ListLayout
              items={showcase.reviews}
              renderItem={(review, idx) => (
                <ReviewItem key={review.id} review={review} />
              )}
            />
          )}
          {layout === 'grid' && (
            <GridLayout
              items={showcase.reviews}
              renderItem={(review, idx) => (
                <ReviewItem key={review.id} review={review} />
              )}
            />
          )}
          {layout === 'marquee' && (
            <MarqueeLayout
              items={showcase.reviews}
              renderItem={(review, idx) => (
                <ReviewItem key={review.id} review={review} />
              )}
              rowsConfig={[
                { direction: 'forward', speed: 40 },
                { direction: 'forward', speed: 20 },
              ]}
            />
          )}
          {layout === 'flow' && (
            <FlowLayout
              items={showcase.reviews}
              columns={4}
              renderItem={(review, idx) => (
                <ReviewItem key={review.id} review={review} />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

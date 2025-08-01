'use client';

import { useEffect, useState, use } from 'react';
import { BiArrowBack, BiCodeAlt, BiPlus, BiSave, BiShow } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { WidgetContent } from '@reviewsup/embed-react';
import { BsBoxArrowUpRight, BsShare } from 'react-icons/bs';
import { WidgetPageConfig } from '@/modules/widget/widget-page-config';
import { useWidgetContext } from '@/modules/widget/context/widget-context';
import { WidgetEmbedDialog } from '@/modules/widget/widget-embed-dialog';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

export default function WidgetIdPage(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const params = use(props.params);
  const { lang, productId, id } = params;
  const { getWidget, widget, widgetConfig } = useWidgetContext();
  useEffect(() => {
    if (!params.id) return;
    getWidget(params.id);
  }, [params]);

  if (!widget || !widget.reviews) return null;

  return (
    <DashboardRoot>
      <DashboardHeader
        title={`Edit ${widget.name}`}
        subtitle={
          'Easily collect testimonials from your customers using a simple link'
        }
        enableBack={true}
        url={`/dashboard/${productId}/widgets`}
        buttons={
          <>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/widgets/${widget.shortId}`,
                );
                toast.success('Link copied to clipboard!');
              }}
              variant="outline"
              size={'lg'}
            >
              <BsShare className="text-2xl" />
              <span className="hidden md:flex">Share</span>
            </Button>
            <Button
              onClick={() => {
                window.open(`/widgets/${widget.shortId}`, '_blank');
              }}
              variant="outline"
              size={'lg'}
            >
              <BsBoxArrowUpRight className="text-2xl" />
              <span className="hidden md:flex">Open</span>
            </Button>
            <WidgetEmbedDialog widgetShortId={widget.shortId || ''}>
              <Button className="" variant="default" size={'lg'}>
                <BiCodeAlt className="text-2xl" />
                <span className="hidden md:flex">Embed</span>
              </Button>
            </WidgetEmbedDialog>
          </>
        }
      />

      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        <div className={'flex flex-col md:col-span-1 w-full gap-2'}>
          <WidgetPageConfig />
        </div>
        <div className="md:col-span-3 bg-gray-50 p-8 border rounded shadow h-[750px] overflow-y-auto items-center justify-center">
          <WidgetContent widget={widget} widgetConfig={widgetConfig} />
        </div>
      </div>
    </DashboardRoot>
  );
}

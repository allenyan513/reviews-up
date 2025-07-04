'use client';
import { ShowcaseClient } from '@reviewsup/embed-react';
import { useState } from 'react';
import { cn } from '@reviewsup/ui/lib/utils';
import { Button } from '@reviewsup/ui/button';
import { CodeViewer, FileTreeItem } from '@/components/code-viewer';
import { BsPhone, BsTablet, BsWindowDesktop } from 'react-icons/bs';
import { GoDeviceDesktop } from 'react-icons/go';

export function ShowcaseWrapper(props: {
  title: string;
  subtitle: React.ReactNode;
  formId: string;
  items: {
    title: string;
    showcaseId: string;
    rawFileTree: FileTreeItem[];
    codeMap: Record<string, string>;
  }[];
}) {
  const { items, title, subtitle, formId } = props;
  const [currentItem, setCurrentItem] = useState<any>(items[0]);

  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [mode, setMode] = useState<'mobile' | 'pad' | 'desktop'>('desktop');

  return (
    <section
      id="widget"
      className="px-4 w-full md:max-w-5xl flex flex-col gap-4"
    >
      <h2 className="w-full text-center text-4xl font-semibold">{title}</h2>
      <h3 className="text-muted-foreground sm:text-lg text-center mb-4">
        {subtitle}
      </h3>
      <div className="flex flex-row gap-2 w-full items-start">
        {items.map((item) => (
          <div
            onClick={() => {
              // setCurrentShowcaseId(item.showcaseId);
              setCurrentItem(item);
            }}
            className={cn(
              'flex flex-row',
              'cursor-pointer',
              'px-4 py-2 rounded-md',
              'border border-gray-200',
              currentItem?.showcaseId === item.showcaseId
                ? 'bg-red-100 border-red-300'
                : 'bg-white',
            )}
            key={item.title}
          >
            {item.title}
          </div>
        ))}
      </div>
      <div className="justify-between w-full hidden md:flex md:flex-row">
        <div className="flex flex-row items-center border border-gray-200 rounded-md p-1 bg-gray-100">
          <Button
            className={cn(
              'rounded text-xs',
              view === 'preview' ? 'bg-white text-black' : 'text-gray-700',
            )}
            variant="ghost"
            size={'sm'}
            onClick={() => setView('preview')}
          >
            Preview
          </Button>
          <Button
            className={cn(
              'rounded text-xs',
              view === 'code' ? 'bg-white text-black' : 'text-gray-700',
            )}
            variant="ghost"
            size={'sm'}
            onClick={() => setView('code')}
          >
            Code
          </Button>
        </div>
        <div className="flex flex-row border border-gray-200 rounded-md p-1 bg-gray-100">
          <Button
            className={cn(
              mode === 'desktop' ? 'bg-white text-black' : 'text-gray-700',
            )}
            variant="ghost"
            onClick={() => setMode('desktop')}
          >
            <GoDeviceDesktop />
          </Button>
          <Button
            className={cn(
              mode === 'pad' ? 'bg-white text-black' : 'text-gray-700',
            )}
            variant="ghost"
            onClick={() => setMode('pad')}
          >
            <BsTablet />
          </Button>
          <Button
            className={cn(
              mode === 'mobile' ? 'bg-white text-black' : 'text-gray-700',
            )}
            variant="ghost"
            onClick={() => setMode('mobile')}
          >
            <BsPhone />
          </Button>
        </div>
      </div>
      {view === 'preview' && (
        <div
          className={cn(
            'flex flex-col gap-4',
            mode === 'mobile' && 'w-[375px]',
            mode === 'pad' && 'w-[768px]',
            mode === 'desktop' && 'w-full',
          )}
        >
          <ShowcaseClient
            showcaseId={currentItem?.showcaseId || ''}
            options={{
              url: process.env.NEXT_PUBLIC_API_URL as string,
            }}
          />
        </div>
      )}
      {view === 'code' && (
        <CodeViewer
          rawFileTree={currentItem.rawFileTree}
          codeMap={currentItem.codeMap}
        />
      )}
    </section>
  );
}

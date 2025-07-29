'use client';
import { Widget } from '@reviewsup/embed-react';
import { useState } from 'react';
import { cn } from '@reviewsup/ui/lib/utils';
import { CodeBlockClient } from '@/components/code-block-client';
import { Button } from '@reviewsup/ui/button';

export function WidgetSimpleWrapper(props: {
  title: string;
  subtitle: React.ReactNode;
  items: {
    title: string;
    widgetId: string;
  }[];
  embedCode: string;
}) {
  const { items, title, subtitle, embedCode } = props;
  const [currentItem, setCurrentItem] = useState<any>(items[0]);
  return (
    <section className="w-full flex flex-col items-center gap-4">
      <h2 className="w-full text-center text-4xl font-semibold">{title}</h2>
      <h3 className="text-muted-foreground sm:text-lg text-center mb-4">
        {subtitle}
      </h3>
      <div className="flex flex-row gap-2 w-full items-start">
        {items.map((item) => (
          <div
            onClick={() => {
              setCurrentItem(item);
            }}
            className={cn(
              'cursor-pointer line-clamp-1 overflow-hidden',
              'px-4 py-2 rounded-md',
              'border border-gray-200',
              currentItem?.widgetId === item.widgetId
                ? 'bg-red-100 border-red-300'
                : 'bg-white',
            )}
            key={item.title}
          >
            {item.title}
          </div>
        ))}
      </div>
      <Widget
        id={currentItem?.widgetId || ''}
        options={{
          url: process.env.NEXT_PUBLIC_API_URL as string,
        }}
      />
      <div className="flex flex-col gap-4 mt-8 items-start mx-auto border border-gray-200 p-4 rounded-md bg-gray-100">
        <div className='flex flex-col gap-1'>
          <p className="text-md">Try our sample embed code</p>
          <p className="text-sm">
            Embed the wall of love to your website in 1 minute
          </p>
        </div>
        <div className="rounded-md hidden lg:block lg:max-w-3xl overflow-x-scroll border border-gray-300">
          <CodeBlockClient lang={'html'}>{embedCode}</CodeBlockClient>
        </div>
        <Button
          className="rounded-md bg-red-400 text-white hover:bg-red-500 transition-colors"
          variant="default"
          onClick={() => {
            navigator.clipboard.writeText(embedCode);
            alert('Embed code copied to clipboard!');
          }}
        >
          Copy embed code
        </Button>
      </div>
    </section>
  );
}

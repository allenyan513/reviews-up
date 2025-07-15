'use client';

import React, { useEffect, useState, use } from 'react';
import DialogNewWidget from '@/modules/widget/dialog-new-widget';
import { useWidgetContext } from '@/modules/widget/context/widget-context';
import { WidgetListItem } from '@/modules/widget/widget-list-item';

export default function WidgetListPage(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const params = use(props.params);
  const { getWidgets, widgets, deleteWidget } = useWidgetContext();
  useEffect(() => {
    getWidgets(params.productId);
  }, []);

  if (!widgets || !widgets.items) {
    return null;
  }
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Widgets</h1>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <DialogNewWidget />
      </div>

      {/* Widget List */}
      <div className="space-y-4 w-full">
        {widgets.items &&
          widgets.items.map((item) => (
            <WidgetListItem
              key={item.id}
              item={item}
              lang={params.lang}
              productId={params.productId}
            />
          ))}
      </div>
    </div>
  );
}

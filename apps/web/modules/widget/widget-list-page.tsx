'use client';

import React, { useEffect, useState, use } from 'react';
import DialogNewWidget from '@/modules/widget/dialog-new-widget';
import { useWidgetContext } from '@/modules/widget/context/widget-context';
import { WidgetListItem } from '@/modules/widget/widget-list-item';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

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
    <DashboardRoot>
      <DashboardHeader
        title="Widgets"
        subtitle="Manage your widgets to enhance your product's functionality."
        buttons={<DialogNewWidget />}
      />
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
    </DashboardRoot>
  );
}

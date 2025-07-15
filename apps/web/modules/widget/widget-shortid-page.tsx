'use client';
import { api } from '@/lib/api-client';
import { Suspense, use, useEffect, useState } from 'react';
import {
  WidgetConfig,
  WidgetEntity,
} from '@reviewsup/api/widgets';
import toast from 'react-hot-toast';
import { WidgetPageReviewClient } from '@reviewsup/embed-react';

export default function WidgetShortidPage(props: {
  params: Promise<{
    lang: string;
    shortId: string;
  }>;
}) {
  const { lang, shortId } = use(props.params);
  const [widget, setWidget] = useState<WidgetEntity>();

  useEffect(() => {
    api.widget
      .getWidgetByShortId(shortId)
      .then((response) => {
        setWidget(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  if (!widget || !widget.reviews) return null;

  return (
    <WidgetPageReviewClient
      widget={widget}
      widgetConfig={widget.config as WidgetConfig}
    />
  );
}

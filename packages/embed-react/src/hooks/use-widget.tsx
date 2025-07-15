'use client';
import { api } from '../api';
import { useEffect, useState } from 'react';
import { WidgetEntity } from '@reviewsup/api/widgets';
import { RequestOptions } from '../api/request-options';

export function useWidget(widgetId: string, options?: RequestOptions) {
  const [widget, setWidget] = useState<WidgetEntity>();
  const [error, setError] = useState<Error>();

  async function fetchWidget() {
    try {
      const response = await api.widget.getWidgetByShortId(
        widgetId,
        options,
      );
      setWidget(response);
    } catch (err) {
      setError(err as Error);
    }
  }

  useEffect(() => {
    if (!widgetId) {
      setError(new Error('Widget ID is required'));
      return;
    }
    fetchWidget();
  }, [widgetId]);

  return {
    widget,
    error,
  };
}

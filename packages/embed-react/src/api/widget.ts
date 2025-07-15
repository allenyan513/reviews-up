import { WidgetEntity } from '@reviewsup/api/widgets';
import { defaultRequestOptions, RequestOptions } from './request-options';

export const widget = {
  getWidgetByShortId: async (
    shortId: string,
    options?: RequestOptions,
  ): Promise<WidgetEntity> => {
    if (!shortId) {
      throw new Error('Short ID is required to fetch the widget.');
    }
    const url = options?.url || defaultRequestOptions.url;
    const res = await fetch(`${url}/widgets/shortId/${shortId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json() as Promise<WidgetEntity>;
  },
};

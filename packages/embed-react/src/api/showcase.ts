import { ShowcaseEntity } from '@reviewsup/api/showcases';
import { defaultRequestOptions, RequestOptions } from './request-options';

export const showcase = {
  getShowcaseByShortId: async (
    shortId: string,
    options?: RequestOptions,
  ): Promise<ShowcaseEntity> => {
    if (!shortId) {
      throw new Error('Short ID is required to fetch the showcase.');
    }
    const url = options?.url || defaultRequestOptions.url;
    const res = await fetch(`${url}/showcases/shortId/${shortId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json() as Promise<ShowcaseEntity>;
  },
};

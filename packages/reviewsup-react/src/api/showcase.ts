import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';
import { REVIEWSUP_API_URL } from './index';

// Define your API methods, each accepting the session object
export const showcase = {
  getShowcaseByShortId: async (shortId: string) => {
    if (!shortId) {
      throw new Error('Short ID is required to fetch the showcase.');
    }
    const res = await fetch(`${REVIEWSUP_API_URL}/showcases/shortId/${shortId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  },
};

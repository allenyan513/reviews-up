import { REVIEWSUP_API_URL } from './index';
import { ShowcaseEntity } from '@repo/api/showcases/entities/showcase.entity';

export const showcase = {
  getShowcaseByShortId: async (shortId: string): Promise<ShowcaseEntity> => {
    if (!shortId) {
      throw new Error('Short ID is required to fetch the showcase.');
    }
    const res = await fetch(
      `${REVIEWSUP_API_URL}/showcases/shortId/${shortId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.json() as Promise<ShowcaseEntity>;
  },
};

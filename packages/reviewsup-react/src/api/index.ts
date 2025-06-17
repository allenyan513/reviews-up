import { showcase } from './showcase';

export const REVIEWSUP_API_URL = 'https://api.reviewsup.io';
// export const REVIEWSUP_API_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://api.reviewsup.io'
//     : 'http://localhost:5500';

export const api = {
  showcase: showcase,
};

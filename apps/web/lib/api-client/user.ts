import { authFetch } from './auth-fetch';
import { User } from '@repo/api/users/index';

export const user = {
  findOneBySlug: (slug: string): Promise<User | null> =>
    authFetch(`/users/slug/${slug}`, 'GET', {}),
};

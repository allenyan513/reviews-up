import { authFetch } from './auth-fetch';
import { UserEntity } from '@reviewsup/api/users';

export const user = {
  findCurrent: (): Promise<UserEntity> => authFetch(`/users/current`, 'GET', {}),
  findOneBySlug: (slug: string): Promise<UserEntity | null> =>
    authFetch(`/users/slug/${slug}`, 'GET', {}),
  deleteAccount: (): Promise<void> => authFetch(`/users/delete`, 'DELETE', {}),
};

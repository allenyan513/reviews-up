import { authFetch } from './auth-fetch';
import { UserEntity } from '@reviewsup/api/users';

export const auth = {
  getSession: async (): Promise<UserEntity | null> => {
    try {
      return await authFetch('/users/profile', 'GET', {});
    } catch (error) {
      return null;
    }
  },
  googleSignIn: async (): Promise<UserEntity | null> => {
    return await authFetch('/auth/google', 'GET');
  },

  sendMagicLink: async (email: string, redirect?: string): Promise<void> => {
    try {
      await authFetch('/auth/send-magic-link', 'POST', {
        email: email,
        redirect: redirect || '',
      });
    } catch (error) {
      console.error(error);
    }
  },
};

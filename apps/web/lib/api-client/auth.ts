import { authFetch } from './auth-fetch';
import { User } from '@repo/api/users/entities/user.entity';

export const auth = {
  getSession: async (): Promise<User | null> => {
    try {
      return await authFetch('/users/profile', 'GET', {});
    } catch (error) {
      return null;
    }
  },
  googleSignIn: async (): Promise<User | null> => {
    return await authFetch('/auth/google', 'GET');
  },

  sendMagicLink: async (email: string): Promise<void> => {
    try {
      await authFetch('/auth/send-magic-link', 'POST', {
        email: email,
      });
    } catch (error) {
      console.error(error);
    }
  },
};

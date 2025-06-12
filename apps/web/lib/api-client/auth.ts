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
  }
};

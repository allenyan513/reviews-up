import { api } from '@/lib/api-client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useVerifyEmbed(url: string) {
  const [loading, setLoading] = useState(false);
  const verify = () => {
    setLoading(true);
  };
  return {
    loading,
    verify,
  };
}

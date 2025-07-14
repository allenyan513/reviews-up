import { api } from '@/lib/api-client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useVerifyEmbed(url: string, showcaseShortId: string) {
  const [loading, setLoading] = useState(false);
  const verify = () => {
    setLoading(true);
    api.showcase
      .verifyWidgetEmbedding({
        url: url,
        showcaseShortId: showcaseShortId,
      })
      .then((res) => {
        setLoading(false);
        if (res.code === 200 && res.data) {
          toast.success(`Widget embedding verified successfully!`);
        } else {
          toast.error('Widget embedding verification failed');
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(`Widget embedding verification failed`);
      });
  };
  return {
    loading,
    verify,
  };
}

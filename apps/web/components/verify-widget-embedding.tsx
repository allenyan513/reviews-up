import { api } from '@/lib/api-client';
import { LoadingText } from '@reviewsup/ui/loading-text';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function VerifyWidgetEmbedding(props: {
  url: string;
  showcaseShortId: string;
  children: React.ReactNode;
}) {
  const { url, showcaseShortId } = props;
  const [loading, setLoading] = useState(false);
  return (
    <span
      onClick={() => {
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
      }}
      className="text-blue-500 hover:underline cursor-pointer px-1"
    >
      {loading ? <LoadingText>Verifying...</LoadingText> : props.children}
    </span>
  );
}

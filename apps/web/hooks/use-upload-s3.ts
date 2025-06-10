/**
 * useUploadS3 hook
 */

import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useSession } from 'next-auth/react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UseUploadS3Result {
  uploadFile: (file: File) => Promise<string | null>;
  status: UploadStatus;
  error: string | null;
}

export function useUploadS3(): UseUploadS3Result {
  // const { data: session } = useSession();
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setStatus('uploading');
    setError(null);
    try {
      // 1. Get pre-signed URL from your backend
      const { signedUrl, key } = await api.getSignedUrl(
        {
          fileName: file.name,
          fileType: file.type,
        },
        { session: null },
      );
      // 2. Upload file to S3
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload file to S3');
      setStatus('success');
      // Return the S3 file URL (you may need to construct it based on your bucket)
      return key
        ? `https://s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}/${key}`
        : null;
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Upload failed');
      return null;
    }
  };

  return { uploadFile, status, error };
}

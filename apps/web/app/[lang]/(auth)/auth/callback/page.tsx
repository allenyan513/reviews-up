'use client';

import { use, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function CallbackPage(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    if (!access_token) return;
    localStorage.setItem('access_token', access_token);
    redirect(`/`);
  }, [searchParams, router]);

  return null
}

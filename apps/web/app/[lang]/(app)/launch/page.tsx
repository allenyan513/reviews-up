'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api-client';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  useEffect(() => {
    api.auth.getSession().then((user) => {
      if (!user) {
        redirect(`/auth/signin?redirect=${encodeURIComponent(`/launch`)}`);
      } else {
        redirect(`/${user.Workspace[0].id}/promotion/my-products`);
      }
    });
  }, []);
  return null;
}

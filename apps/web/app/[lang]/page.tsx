'use client';
import { api } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { use, useEffect } from 'react';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  useEffect(() => {
    api.auth.getSession().then((user) => {
      if (!user) {
        return redirect(`/auth/signin`);
      } else {
        return redirect(`/${user?.Workspace?.[0]?.id}/reviews`);
      }
    });
  }, []);

  return null;
}

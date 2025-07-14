'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { api } from '@/lib/api-client';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  useEffect(() => {
    api.auth.getSession().then((user) => {
      if (!user) {
        return redirect(
          `/auth/signin?redirect=${encodeURIComponent(`/${user.Workspace[0].id}/promotion/my-products`)}`,
        );
      } else {
        return redirect(`/${user.Workspace[0].id}/promotion/my-products`);
      }
    });
  }, []);
  return null;
}

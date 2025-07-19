'use client';
import { api } from '@/lib/api-client';
import { UserEntity } from '@reviewsup/api/users';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  useEffect(() => {
    api.auth.getSession().then((user: UserEntity | null) => {
      if (!user) {
        return redirect(`/auth/signin`);
      } else {
        if (!user.products || user.products.length === 0) {
          return redirect(`/products/new`);
        }
        return redirect(`/${user?.products?.[0]?.id}/overview`);
      }
    });
  }, []);

  return null;
}

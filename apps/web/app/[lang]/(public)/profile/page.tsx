'use client';
import { useSession } from '@/context/UserProvider';
import { api } from '@/lib/api-client';
import { redirect } from 'next/navigation';
import { use, useEffect } from 'react';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  const { user } = useSession({
    required: false,
  });

  useEffect(() => {
    if (!user) {
      redirect('/');
      return;
    }
    const slug = user.id;
    redirect(`/profile/${slug}`);
  }, [user]);

  return null;
}

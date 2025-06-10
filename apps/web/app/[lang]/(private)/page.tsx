'use client';
import { redirect, useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { useUserContext } from '@/context/UserProvider';
import { use, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RootRoute(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const session = useSession({
    required: true,
  });
  const { lang } = use(props.params);
  const { defaultWorkspace } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!defaultWorkspace || !lang) {
      return;
    }
    router.push(`/${lang}/${defaultWorkspace?.id}/reviews`);
  }, [defaultWorkspace, lang]);
  return null;
}

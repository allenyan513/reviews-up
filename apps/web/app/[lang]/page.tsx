import { api } from '@/lib/api-client';
import { redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const user = await api.auth.getSession();
  if (!user) {
    redirect(`/${lang}/auth/signin`);
  }
  return redirect(`/${lang}/${user?.Workspace?.[0]?.id}/reviews`);
}

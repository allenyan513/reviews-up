import { api } from '@/lib/api-client';
import { redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  console.log(lang);
  const user = await api.auth.getSession();
  console.log(user);
  if (!user) {
    return redirect(`/${lang}/auth/signin`);
  }
  return redirect(`/${lang}/${user?.Workspace?.[0]?.id}/reviews`);
}

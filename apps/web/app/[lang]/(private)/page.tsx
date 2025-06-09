import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function RootRoute(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const params = await props.params;
  const session = await getServerSession();
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/`);
    return;
  }
  const workspaceId = 'default-workspace';
  redirect(`/${params.lang}/${workspaceId}/forms`);
}

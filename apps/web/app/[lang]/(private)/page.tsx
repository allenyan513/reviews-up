import { redirect } from 'next/navigation';

export default async function RootRoute(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const params = await props.params;
  const workspaceId = 'default-workspace';
  redirect(`/${params.lang}/${workspaceId}/forms`)
}

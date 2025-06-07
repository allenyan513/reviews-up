'use client';

import { useEffect, useState } from 'react';

export default function Page(props:{
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>
}) {
  const [params, setParams] = useState<{ lang: string; workspaceId: string; id: string } | null>(null);
  useEffect(() => {
    props.params.then(setParams);
  }, []);


  if(!params) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Forms List Page </h1>
      <p>Lang: {params.lang}</p>
      <p>WorkspaceId: {params.workspaceId}</p>
      <p>FormId: {params.id}</p>
    </div>
  )
}

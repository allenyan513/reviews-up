'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { redirect } from 'next/navigation';

interface PageParams {
  lang: string;
  workspaceId: string;
  id: string;
}

export default function Page(props: { params: Promise<PageParams> }) {
  const params = use(props.params);
  const session = useSession({
    required: true,
  });
  const [form, setForm] = useState<FormEntity>();

  useEffect(() => {
    if (!session.data) return;
    api
      .getForm(params.id, {
        session: session.data,
      })
      .then((response) => {
        setForm(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session]);

  if (!form) return null;

  redirect(`/${params.lang}/${params.workspaceId}/forms/${form.id}/default`);
}

'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api-client';
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
  const [form, setForm] = useState<FormEntity>();

  useEffect(() => {
    api.form
      .getForm(params.id)
      .then((response) => {
        setForm(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  if (!form) return null;

  redirect(`/${params.lang}/${params.workspaceId}/forms/${form.id}/default`);
}

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BiArrowBack, BiPlus, BiSave } from 'react-icons/bi';
import { api } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { PublicFormPage } from '@/app/[lang]/(public)/forms/[shortId]/page';
import { redirect } from 'next/navigation';

interface PageParams {
  lang: string;
  workspaceId: string;
  id: string;
}

export default function Page(props: { params: Promise<PageParams> }) {
  const session = useSession({
    required: true,
  });
  const [params, setParams] = useState<PageParams>();
  const [form, setForm] = useState<FormEntity>();

  useEffect(() => {
    props.params.then(setParams);
  }, []);

  useEffect(() => {
    if (!session.data || !params) return;
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
  }, [session, params]);

  if (!form || !params) return null;

  redirect( `/${params.lang}/${params.workspaceId}/forms/${form.id}/default` )
}


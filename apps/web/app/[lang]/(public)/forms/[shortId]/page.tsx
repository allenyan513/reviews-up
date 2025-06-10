'use client';
import { api } from '@/lib/apiClient';
import { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { PageParams } from '@/types/page-params';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { PageFormReview } from '@/views/page-form-review';

export default function PublicFormRoute(props: {
  params: Promise<PageParams>;
}) {
  const params = use(props.params);
  const [form, setForm] = useState<FormEntity | null>(null);
  useEffect(() => {
    api
      .getFormByShortId(params.shortId, {
        session: null,
      })
      .then((response) => {
        setForm(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  if (!form) {
    return null;
  }

  return (
    <PageFormReview
      mode={'public'}
      lang={params.lang}
      shortId={params.shortId}
      form={form}
      config={form.config as FormConfig}
    />
  );
}


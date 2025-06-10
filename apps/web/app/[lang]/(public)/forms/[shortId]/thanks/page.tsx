'use client';
import { api } from '@/lib/apiClient';
import { useEffect, useState, use } from 'react';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { PageParams } from '@/types/page-params';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { PageFormThanksReview } from '@/views/page-form-thanks-review';

export default function PublicFormThanksRoute(props: {
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

  if (!form || !params) {
    return null;
  }

  return (
    <PageFormThanksReview
      mode={'public'}
      lang={params.lang}
      shortId={params.shortId}
      form={form}
      config={form.config as FormConfig}
    />
  );
}


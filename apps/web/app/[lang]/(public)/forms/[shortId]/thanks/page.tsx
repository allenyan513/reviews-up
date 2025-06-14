'use client';
import { useEffect, useState, use } from 'react';
import { PageFormThanksReview } from '@/modules/form/page-form-thanks-review';
import { useFormContext } from '@/modules/form/context/FormProvider';

export default function PublicFormThanksRoute(props: {
  params: Promise<{
    shortId: string;
    lang: string;
  }>;
}) {
  const { shortId } = use(props.params);
  const { formConfig, fetchFormByShortId } = useFormContext();

  useEffect(() => {
    if (!shortId) return;
    fetchFormByShortId(shortId);
  }, [shortId]);

  if (!formConfig) {
    return null;
  }
  return <PageFormThanksReview mode={'public'} formConfig={formConfig} />;
}

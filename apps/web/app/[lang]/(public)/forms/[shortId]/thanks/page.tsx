'use client';
import {useEffect, useState, use} from 'react';
import {FormThanksPreviewView} from '@/modules/form/thanks/form-thanks-preview-view';
import {useFormContext} from '@/modules/form/context/FormProvider';
import {useSession} from '@/context/UserProvider';

export default function PublicFormThanksRoute(props: {
  params: Promise<{
    shortId: string;
    lang: string;
  }>;
}) {
  const {user} = useSession({
    required: true,
  })
  const {shortId} = use(props.params);
  const {formConfig, fetchFormByShortId} = useFormContext();

  useEffect(() => {
    if (!shortId) return;
    fetchFormByShortId(shortId);
  }, [shortId]);

  if (!formConfig) {
    return null;
  }
  return <FormThanksPreviewView mode={'public'} formConfig={formConfig}/>;
}

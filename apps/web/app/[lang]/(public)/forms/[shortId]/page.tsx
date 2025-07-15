'use client';
import { use, useEffect } from 'react';
import { FormDefaultPreviewView } from '@/modules/form/default/form-default-preview-view';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { useSession } from '@/context/UserProvider';

export default function PublicFormRoute(props: {
  params: Promise<{
    shortId: string;
    lang: string;
  }>;
}) {
  const { lang, shortId } = use(props.params);
  const { form, fetchFormByShortId } = useFormContext();
  useEffect(() => {
    if (!shortId) return;
    fetchFormByShortId(shortId);
  }, [shortId]);

  if (!form) {
    return null;
  }
  return (
    <FormDefaultPreviewView
      className={
        'flex flex-col w-full min-h-screen justify-center items-center bg-gray-100 p-4'
      }
      id={form.id || ''}
      lang={lang}
      productId={form.productId || ''}
      shortId={form.shortId || ''}
      mode={'public'}
    />
  );
}

'use client';
import {use, useEffect} from 'react';
import {PageFormReview} from '@/modules/form/page-form-review';
import {useFormContext} from '@/modules/form/context/FormProvider';
import {useSession} from "@/context/UserProvider";

export default function PublicFormRoute(props: {
  params: Promise<{
    shortId: string;
    lang: string;
  }>;
}) {
  const {user} = useSession({required: false,})
  const {lang, shortId} = use(props.params);
  const {form, fetchFormByShortId} = useFormContext();
  useEffect(() => {
    if (!shortId) return;
    fetchFormByShortId(shortId);
  }, [shortId]);

  if (!form) {
    return null;
  }
  return (
    <PageFormReview
      className={'flex flex-col w-full min-h-screen justify-center items-center bg-gray-100'}
      id={form.id}
      lang={lang}
      workspaceId={form.workspaceId}
      shortId={form.shortId}
      mode={'public'}
    />
  );
}

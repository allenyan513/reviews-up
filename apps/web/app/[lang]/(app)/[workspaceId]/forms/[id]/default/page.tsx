'use client';

import { use } from 'react';
import { PageFormReview } from '@/modules/form/page-form-review';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { FormPageConfig } from '@/modules/form/form-page-config';

export default function Page(props: {
  params: Promise<{
    id: string;
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { id, lang, workspaceId } = use(props.params);
  const { form, formConfig } = useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4 border-l border-gray-300 px-4 flex flex-col gap-4">
        <FormPageConfig />
      </div>
      <PageFormReview
        className="col-span-8 flex flex-col w-full h-[760px] overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 items-center"
        id={id}
        lang={lang}
        shortId={form.shortId}
        workspaceId={workspaceId}
        mode={'edit'}
      />
    </div>
  );
}

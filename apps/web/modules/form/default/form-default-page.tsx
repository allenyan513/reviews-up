'use client';

import { use } from 'react';
import { FormDefaultPreviewView } from '@/modules/form/default/form-default-preview-view';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { FormPageConfig } from '@/modules/form/default/form-page-config';

export default function FormDefaultPage(props: {
  params: Promise<{
    id: string;
    lang: string;
    productId: string;
  }>;
}) {
  const { id, lang, productId } = use(props.params);
  const { form, formConfig } = useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
      <div className="md:col-span-3 flex flex-col gap-4">
        <FormPageConfig />
      </div>
      <div className="md:col-span-9 flex flex-col w-full py-8 overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 items-center justify-center">
        <FormDefaultPreviewView
          id={id}
          lang={lang}
          shortId={form.shortId || ''}
          productId={productId}
          mode={'edit'}
        />
      </div>
    </div>
  );
}

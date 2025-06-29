'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { FormThanksPreviewView } from '@/modules/form/thanks/form-thanks-preview-view';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { FormThanksConfigView } from '@/modules/form/thanks/form-thanks-config-view';


export default function FormThanksPage(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const { lang, id, workspaceId } = use(props.params);
  const { form, formConfig, setFormConfig, updateFormConfig } =
    useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
      <div className="md:col-span-4 border-l border-gray-300 px-4 flex flex-col gap-4">
        <FormThanksConfigView />
      </div>
      <div className="md:col-span-8 border border-gray-300 rounded-lg">
        <FormThanksPreviewView mode={'edit'} formConfig={formConfig} />
      </div>
    </div>
  );
}

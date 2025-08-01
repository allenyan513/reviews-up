'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { FormThanksPreviewView } from '@/modules/form/thanks/form-thanks-preview-view';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { FormThanksConfigView } from '@/modules/form/thanks/form-thanks-config-view';

export default function FormThanksPage(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
}) {
  const { form, formConfig } = useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
      <div className="md:col-span-3 flex flex-col gap-4">
        <FormThanksConfigView />
      </div>
      {/*<div className="md:col-span-9 flex flex-col w-full py-8 overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 items-center justify-center">*/}
      <div className="md:col-span-9 flex flex-col w-full py-8 overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 items-center justify-center">
        <FormThanksPreviewView mode={'edit'} formConfig={formConfig} />
      </div>
    </div>
  );
}

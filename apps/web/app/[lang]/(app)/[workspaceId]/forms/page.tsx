'use client';

import {use, useEffect, useState} from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import {useFormContext} from '@/modules/form/context/FormProvider';
import {FormListItem} from '@/modules/form/form-list-item';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const {lang, workspaceId} = use(props.params);
  const {fetchForms, forms} = useFormContext();

  useEffect(() => {
    if (!workspaceId) return;
    fetchForms(workspaceId);
  }, []);

  if (!forms) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Forms</h1>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <CreateFormDialog/>
      </div>
      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <FormListItem
            key={form.id}
            lang={lang}
            workspaceId={workspaceId}
            item={form}
          />
        ))}
      </div>
    </div>
  );
}

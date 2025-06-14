'use client';

import { use, useEffect, useState } from 'react';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { api } from '@/lib/api-client';
import { BiEdit, BiFile, BiMailSend, BiShare, BiTrash } from 'react-icons/bi';
import { ActionIcon } from '@/components/action-icon';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import Link from 'next/link';
import { useFormContext } from '@/modules/form/context/FormProvider';

export function FormItem(props: {
  lang: string;
  workspaceId: string;
  form: FormEntity;
}) {
  const { lang, workspaceId, form } = props;
  return (
    <Link
      href={`/${lang}/${workspaceId}/forms/${form.id}`}
      key={form.id}
      className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center">
        <div className="p-3 bg-gray-100 rounded-md mr-4">
          <BiFile className="text-2xl" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-900">{form.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5 flex flex-row items-center gap-2 ">
            <span className="font-semibold">{form.reviewCount} responses</span>
            <span>•</span>
            <span> created on {form.createdAt.toLocaleString()} </span>
          </p>
        </div>
      </div>
      {/* Action Icons */}
      <div className="flex items-center space-x-1">
        <ActionIcon label="Invite">
          <BiMailSend className="text-2xl" />
        </ActionIcon>
        <ActionIcon label="Link">
          <BiShare className="text-2xl" />
        </ActionIcon>
        <ActionIcon label="Edit">
          <BiEdit className="text-2xl" />
        </ActionIcon>
        <ActionIcon label="Delete">
          <BiTrash className="text-2xl text-red-500" />
        </ActionIcon>
      </div>
    </Link>
  );
}

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const { fetchForms, forms } = useFormContext();

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
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <CreateFormDialog />
      </div>
      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <FormItem
            key={form.id}
            lang={lang} workspaceId={workspaceId} form={form} />
        ))}
      </div>
    </div>
  );
}

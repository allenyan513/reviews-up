'use client';

import { useEffect, useState } from 'react';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { api } from '@/lib/api-client';
import {
  BiEdit,
  BiFile,
  BiMailSend,
  BiShare,
  BiTrash,
} from 'react-icons/bi';
import { ActionIcon } from '@/components/action-icon';
import CreateFormDialog from '@/components/biz/create-form-dialog';
import Link from 'next/link';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const [forms, setForms] = useState<FormEntity[]>([]);
  const [params, setParams] = useState<{
    lang: string;
    workspaceId: string;
  }>();

  useEffect(() => {
    props.params.then((params) => {
      if (!params.workspaceId) return;
      setParams(params);
      api.form
        .getForms(params.workspaceId)
        .then((response) => {
          setForms(response);
        })
        .catch((error) => {
          console.error('Error fetching forms:', error);
        });
    });
  }, []);

  if (!forms.length) return null;

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
        <CreateFormDialog/>
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <Link
            href={`/${params?.lang}/${params?.workspaceId}/forms/${form.id}`}
            key={form.id}
            className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-md mr-4">
                <BiFile className="text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {form.name}
                </h2>
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
        ))}
      </div>
    </div>
  );
}

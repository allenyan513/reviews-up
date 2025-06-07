'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Form } from '@repo/api/forms/entities/form.entity';
import { api } from '@/lib/apiClient';
import {
  BiEdit,
  BiFile,
  BiMailSend,
  BiPlus,
  BiShare,
  BiTrash,
} from 'react-icons/bi';
import { ActionIcon } from '@/components/action-icon';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const session = useSession({
    required: true,
  });

  const [forms, setForms] = useState<Form[]>([]);
  const [params, setParams] = useState<{
    lang: string;
    workspaceId: string;
  } | null>(null);

  useEffect(() => {
    props.params.then(setParams);
  }, []);

  useEffect(() => {
    if (!session.data || !params) return;
    api
      .getForms(params.workspaceId, {
        session: session.data,
      })
      .then((response) => {
        console.log(response);
        setForms(response);
      });
  }, [session, params]);

  if (!params) {
    return null
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Forms</h1>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <button className="flex items-center px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200">
          <BiPlus className='text-2xl mr-2'/> New form
        </button>
      </div>

      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-md mr-4">
                {/* Placeholder for file icon */}
                <BiFile  className='text-2xl'/>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {form.name}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold">
                    {form.name} responses
                  </span>{' '}
                  • created on {form.createdAt.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-1">
              <ActionIcon label="Invite">
                <BiMailSend className='text-2xl'/>
              </ActionIcon>
              <ActionIcon label="Link">
                <BiShare className='text-2xl'/>
              </ActionIcon>
              <ActionIcon label="Edit">
                <BiEdit className='text-2xl'/>
              </ActionIcon>
              <ActionIcon label="Delete">
                <BiTrash className='text-2xl text-red-500'/>
              </ActionIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

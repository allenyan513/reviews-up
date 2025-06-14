'use client';

import { useEffect, useState, use } from 'react';
import { BiCodeAlt, BiFile, BiShow, BiTrash } from 'react-icons/bi';
import { ActionIcon } from '@/components/action-icon';
import { Showcase } from '@repo/database/generated/client/client';
import { api } from '@/lib/api-client';
import { PaginateResponse } from '@repo/api/common/paginate';
import Link from 'next/link';
import DialogNewShowcase from '@/modules/showcase/dialog-new-showcase';
import { useShowcaseContext } from '@/modules/showcase/context/ShowcaseProvider';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const params = use(props.params);
  const { getShowcases, showcases } = useShowcaseContext();
  useEffect(() => {
    getShowcases(params.workspaceId);
  }, []);

  if (!showcases) {
    return null;
  }
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Showcases</h1>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <DialogNewShowcase />
      </div>

      {/* Showcase List */}
      <div className="space-y-4">
        {showcases?.items &&
          showcases?.items.map((item) => (
            <Link
              key={item.id}
              href={`/${params.lang}/${params.workspaceId}/showcases/${item.id}`}
              className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 rounded-md mr-4">
                  <BiFile className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {/*<span className="font-semibold uppercase">{item.type} Type</span>{' '}*/}
                    created on {item.createdAt.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-1">
                <ActionIcon label="Embed">
                  <BiCodeAlt className="text-2xl" />
                </ActionIcon>
                <ActionIcon label="View">
                  <BiShow className="text-2xl" />
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

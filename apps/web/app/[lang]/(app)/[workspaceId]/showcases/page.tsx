'use client';

import React, {useEffect, useState, use} from 'react';
import DialogNewShowcase from '@/modules/showcase/dialog-new-showcase';
import {useShowcaseContext} from '@/modules/showcase/context/ShowcaseProvider';
import {ShowcaseListItem} from '@/modules/showcase/showcase-list-item';


export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const params = use(props.params);
  const {getShowcases, showcases, deleteShowcase} = useShowcaseContext();
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
        <DialogNewShowcase/>
      </div>

      {/* Showcase List */}
      <div className="space-y-4 w-full">
        {showcases?.items && showcases?.items.map((item) => (
          <ShowcaseListItem
            key={item.id}
            item={item}
            lang={params.lang}
            workspaceId={params.workspaceId}
          />
        ))}
      </div>
    </div>
  );
}

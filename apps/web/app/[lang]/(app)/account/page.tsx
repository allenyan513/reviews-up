'use client';

import { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/components/biz/create-form-dialog';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const params = use(props.params);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Account</h1>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <CreateFormDialog />
      </div>
    </div>
  );
}

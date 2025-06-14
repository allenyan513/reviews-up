'use client';

import { useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {

  const [params, setParams] = useState<{
    lang: string;
  } | null>(null);
  useEffect(() => {
    props.params.then(setParams);
  }, []);

  if (!params) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Easily collect testimonials from your customers using a simple link
          </p>
        </div>
        <CreateFormDialog />
      </div>
    </div>
  );
}

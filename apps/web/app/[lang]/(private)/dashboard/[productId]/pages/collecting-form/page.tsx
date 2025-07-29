'use client';
import { use, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api-client';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { productId } = use(props.params);

  useEffect(() => {
    if (!productId) {
      return;
    }
    api.form.getForms(productId).then((response) => {
      if (response && response.length > 0) {
        const defaultForm = response[0];
        if (!defaultForm) {
          return;
        }
        return redirect(`/dashboard/${productId}/forms/${defaultForm.id}/default`);
      }
    });
  }, []);

  return <div className='p-4'>Loading...</div>;
}

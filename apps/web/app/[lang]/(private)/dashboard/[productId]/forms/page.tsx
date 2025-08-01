'use client';

import { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { FormListItem } from '@/modules/form/form-list-item';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

export default function Page(props: {
  params: Promise<{
    lang: string;
    productId: string;
  }>;
}) {
  const { lang, productId } = use(props.params);
  const { fetchForms, forms } = useFormContext();

  useEffect(() => {
    if (!productId) return;
    fetchForms(productId);
  }, []);

  if (!forms) {
    return null;
  }

  return (
    <DashboardRoot>
      <DashboardHeader
        title={'Forms'}
        subtitle={'Easily collect testimonials from your customers using a simple link'}
        buttons={
          <CreateFormDialog />
        }
      />
      {/* Forms List */}
      <div className="space-y-4">
        {forms.map((form) => (
          <FormListItem
            key={form.id}
            lang={lang}
            productId={productId}
            item={form}
          />
        ))}
      </div>
    </DashboardRoot>
  );
}

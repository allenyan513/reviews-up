'use client';

import React, { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import LanguageSwitch from '@/components/language-switch';
import { Input } from '@/components/ui/input';
import { Divider } from '@/components/divider';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useUserContext } from '@/context/UserProvider';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = use(props.params);
  const { defaultProduct, syncSession } = useUserContext();
  const [productName, setProductName] = useState<string>('');

  const handleSave = () => {
    if (!defaultProduct) return;
    api.product
      .updateOne(defaultProduct?.id || '', {
        name: productName,
      })
      .then((result) => {
        syncSession();
      })
      .catch((error) => {
        console.error('Error updating workspace:', error);
      });
  };

  useEffect(() => {
    if (defaultProduct) {
      setProductName(defaultProduct?.name || '');
    }
  }, [defaultProduct]);

  return (
    <DashboardRoot>
      <DashboardHeader
        title="Product Settings"
        subtitle="Configure your product settings and preferences."
      />
      <div className="flex flex-col border rounded-lg p-6 bg-white shadow-sm gap-4 ">
        <div className="flex flex-row justify-between items-center">
          <label>Product Infomation</label>
          <Link
            href={`/dashboard/${defaultProduct?.id || ''}/settings/product/edit`}
          >
            <FiEdit />
          </Link>
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <label className="block text-gray-700 font-medium mb-2">
            Language
          </label>
          <LanguageSwitch lang={lang} />
        </div>
        <Divider />

        <div className="flex flex-row justify-end items-center">
          <Button size="lg" onClick={handleSave} className="w-32">
            Save
          </Button>
        </div>
      </div>
    </DashboardRoot>
  );
}

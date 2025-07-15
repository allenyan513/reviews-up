'use client';

import { use, useEffect, useState } from 'react';
import CreateFormDialog from '@/modules/form/create-form-dialog';
import LanguageSwitch from '@/components/language-switch';
import { Input } from '@/components/ui/input';
import { Divider } from '@/components/divider';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { useUserContext } from '@/context/UserProvider';

export default function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = use(props.params);
  const { defaultProduct, setDefaultProduct } = useUserContext();
  const [productName, setProductName] = useState<string>('');

  const handleSave = () => {
    if (!defaultProduct) return;
    api.product
      .updateOne(defaultProduct?.id || '', {
        name: productName,
      })
      .then((result) => {
        setDefaultProduct(result);
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
    <div className="min-h-screen p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col border rounded-lg p-6 bg-white shadow-sm gap-4 ">
        <div className="flex flex-row justify-between items-center">
          <label className="block text-gray-700 font-medium mb-2">
            Language
          </label>
          <LanguageSwitch lang={lang} />
        </div>
        <Divider />
        <div className="flex flex-row justify-between items-center">
          <label>Workspace Name</label>
          <Input
            className="w-md"
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
            }}
            placeholder="Enter your workspace name"
          />
        </div>
        <Divider />
        <div className="flex flex-row justify-end items-center">
          <Button size="lg" onClick={handleSave} className="w-32">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

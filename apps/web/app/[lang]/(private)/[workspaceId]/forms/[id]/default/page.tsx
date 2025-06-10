'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { PublicFormPage } from '@/app/[lang]/(public)/forms/[shortId]/page';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { Button } from '@/components/ui/button';

interface PageParams {
  lang: string;
  workspaceId: string;
  id: string;
}

export default function Page(props: { params: Promise<PageParams> }) {
  const params = use(props.params);
  const session = useSession({
    required: true,
  });
  const [form, setForm] = useState<FormEntity>();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);

  const updateFormConfig = async () => {
    if (!form || !formConfig) return;
    try {
      await api.updateForm(
        form.id,
        {
          config: formConfig,
        },
        {
          session: session.data,
        },
      );
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };

  useEffect(() => {
    if (!session.data) return;
    api
      .getForm(params.id, {
        session: session.data,
      })
      .then((response) => {
        setForm(response);
        setFormConfig((response.config as FormConfig) || null);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session]);

  if (!form || !formConfig) return null;

  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-1/2 border-l border-gray-300 px-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="uppercase">Page Config</h2>
          <p className="text-xs text-gray-500">
            Configure the form page settings below. All fields are required.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Brand Name
          </label>
          <input
            type="text"
            id="brandName"
            value={formConfig.brand?.name}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                brand: {
                  ...formConfig.brand,
                  name: e.target.value,
                },
              })
            }
            placeholder="Enter brand name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Brand Logo URL
          </label>
          <input
            type="text"
            id="brandLogo"
            value={formConfig.brand?.logo}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                brand: {
                  ...formConfig.brand,
                  logo: e.target.value,
                },
              })
            }
            placeholder="Enter brand logo URL"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Brand Slogan
          </label>
          <input
            type="text"
            id="brandSlogan"
            value={formConfig.brand?.slogan}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                brand: {
                  ...formConfig.brand,
                  slogan: e.target.value,
                },
              })
            }
            placeholder="Enter brand slogan"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Brand URL
          </label>
          <input
            type="text"
            id="brandUrl"
            value={formConfig.brand?.url}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                brand: {
                  ...formConfig.brand,
                  url: e.target.value,
                },
              })
            }
            placeholder="Enter Brand URL"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Welcome Title
          </label>
          <input
            type="text"
            id="welcomeTitle"
            value={formConfig.welcome?.title}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                welcome: {
                  ...formConfig.welcome,
                  title: e.target.value,
                },
              })
            }
            placeholder="Enter welcome title"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Welcome Message
          </label>
          <textarea
            id="welcomeTitle"
            rows={5}
            value={formConfig.welcome?.message}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                welcome: {
                  ...formConfig.welcome,
                  message: e.target.value,
                },
              })
            }
            placeholder="Enter welcome message"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <Button onClick={updateFormConfig}>Save</Button>
      </div>
      <div className="w-full border border-gray-300 rounded-lg">
        <PublicFormPage
          mode={'edit'}
          lang={params.lang}
          shortId={form.shortId}
          form={form}
          config={formConfig}
        />
      </div>
    </div>
  );
}

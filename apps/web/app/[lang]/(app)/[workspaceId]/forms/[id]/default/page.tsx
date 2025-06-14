'use client';

import { useEffect, useState, use } from 'react';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { PageFormReview } from '@/modules/form/page-form-review';
import { useFormContext } from '@/modules/form/context/FormProvider';

export function PageConfig(props: {}) {
  const { form, formConfig, setFormConfig } = useFormContext();
  const updateFormConfig = async () => {
    if (!form || !formConfig) return;
    try {
      await api.form.updateForm(form.id, {
        config: formConfig,
      });
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };
  return (
    <>
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
          value={formConfig?.brand?.name}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              brand: {
                ...formConfig?.brand,
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
          value={formConfig?.brand?.logo}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              brand: {
                ...formConfig?.brand,
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
          value={formConfig?.brand?.slogan}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              brand: {
                ...formConfig?.brand,
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
          value={formConfig?.brand?.url}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              brand: {
                ...formConfig?.brand,
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
          value={formConfig?.welcome?.title}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              welcome: {
                ...formConfig?.welcome,
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
          value={formConfig?.welcome?.message}
          onChange={(e) =>
            setFormConfig({
              ...formConfig,
              welcome: {
                ...formConfig?.welcome,
                message: e.target.value,
              },
            })
          }
          placeholder="Enter welcome message"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Button onClick={updateFormConfig}>Save</Button>
    </>
  );
}

export default function Page(props: {
  params: Promise<{
    id: string;
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { id, lang, workspaceId } = use(props.params);
  const { form, formConfig } = useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4 border-l border-gray-300 px-4 flex flex-col gap-4">
        <PageConfig />
      </div>
      <PageFormReview
        className="col-span-8 flex flex-col w-full h-[760px] overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 items-center"
        id={id}
        lang={lang}
        shortId={form.shortId}
        workspaceId={workspaceId}
        mode={'edit'}
      />
    </div>
  );
}

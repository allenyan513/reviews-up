'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import { PageFormThanksReview } from '@/modules/form/page-form-thanks-review';
import { useFormContext } from '@/modules/form/context/FormProvider';

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  const { lang, id, workspaceId } = use(props.params);
  const { form, formConfig, setFormConfig, updateFormConfig } =
    useFormContext();
  if (!form || !formConfig) return null;
  return (
    <div className="flex flex-row">
      <div className="w-1/2 border-l border-gray-300 px-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="uppercase">Page Config</h2>
          <p className="text-xs text-gray-500">
            Change the title and message of the thanks page that users see after
            submitting the form.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Thanks Page Title
          </label>
          <input
            type="text"
            id="thanksTitle"
            value={formConfig.thankyou?.title}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                thankyou: {
                  ...formConfig.thankyou,
                  title: e.target.value,
                },
              })
            }
            placeholder="Enter thanks page title"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2">
            <span className="text-red-500">*</span>
            Thanks Page Message
          </label>
          <textarea
            id="thanksMessage"
            rows={4}
            value={formConfig.thankyou?.message}
            onChange={(e) =>
              setFormConfig({
                ...formConfig,
                thankyou: {
                  ...formConfig.thankyou,
                  message: e.target.value,
                },
              })
            }
            placeholder="Enter thanks page message"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <Button onClick={updateFormConfig}>Save</Button>
      </div>
      <div className="w-full border border-gray-300 rounded-lg">
        <PageFormThanksReview mode={'edit'} formConfig={formConfig} />
      </div>
    </div>
  );
}

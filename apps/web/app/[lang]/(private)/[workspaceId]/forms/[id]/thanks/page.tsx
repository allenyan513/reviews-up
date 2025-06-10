'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { Button } from '@/components/ui/button';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { PageFormThanksReview } from '@/views/page-form-thanks-review';

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
        setFormConfig(response.config as FormConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [session]);

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
        <PageFormThanksReview
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

import { useFormContext } from '@/modules/form/context/FormProvider';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { LayoutToggleButton } from '@/components/layout-toggle-button';
import { BsGear } from 'react-icons/bs';
import React from 'react';
import { cn } from '@reviewsup/ui/lib/utils';

export function FormPageConfig() {
  const { form, formConfig, setFormConfig } = useFormContext();
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(true);
  const updateFormConfig = async () => {
    if (!form || !formConfig || !form.id) return;
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
      <LayoutToggleButton
        title="Settings"
        icon={<BsGear className="h-4 w-4" />}
        isOpen={isSettingOpen}
        setIsOpen={setIsSettingOpen}
      />
      <div className={cn('flex flex-col gap-4', isSettingOpen ? '' : 'hidden')}>
        <div>
          <label className="text-sm">
            Welcome Title:
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
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div>
          <label className="text-sm">
            Welcome Message:
          </label>
          <textarea
            id="welcomeTitle"
            rows={10}
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
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
      </div>
      <Button onClick={updateFormConfig}>Save</Button>
    </>
  );
}

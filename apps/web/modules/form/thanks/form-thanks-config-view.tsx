import { useFormContext } from '@/modules/form/context/FormProvider';
import { Button } from '@/components/ui/button';
import { LayoutToggleButton } from '@/components/layout-toggle-button';
import { BsGear } from 'react-icons/bs';
import { cn } from '@reviewsup/ui/lib/utils';
import React from 'react';

export function FormThanksConfigView() {
  const { form, formConfig, setFormConfig, updateFormConfig } =
    useFormContext();
  const [isSettingOpen, setIsSettingOpen] = React.useState<boolean>(true);
  if (!form || !formConfig) return null;
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
            Thanks Page Title:
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
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
        <div>
          <label className="text-sm">
            Thanks Page Message:
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
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>
      </div>
      <Button onClick={updateFormConfig}>Save</Button>
    </>
  );
}

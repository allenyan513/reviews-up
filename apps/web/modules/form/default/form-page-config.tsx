import { useFormContext } from '@/modules/form/context/FormProvider';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export function FormPageConfig() {
  const { form, formConfig, setFormConfig } = useFormContext();
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
      <div className="flex flex-col gap-1">
        <h2 className="uppercase">Page Config</h2>
        <p className="text-xs text-gray-500">
          Configure the form page settings below. All fields are required.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium mb-2">
          <span className="text-red-500">*</span>
          Product Name
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
          Product Logo URL
        </label>
        <input
          type="text"
          id="brandLogo"
          value={formConfig?.brand?.logo || ''}
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
          Product Slogan
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
          Product URL
        </label>
        <input
          type="text"
          id="brandUrl"
          value={formConfig?.brand?.url || ''}
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
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Button onClick={updateFormConfig}>Save</Button>
    </>
  );
}

import { api } from '@/lib/api-client';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';

const FormContext = createContext<{
  forms: FormEntity[] | undefined;
  fetchForms: (workspaceId: string) => void;

  form: FormEntity | undefined;
  fetchForm: (formId: string) => void;
  fetchFormByShortId: (shortId: string) => void;

  formConfig: FormConfig | undefined;
  setFormConfig: (config: FormConfig) => void;

  updateFormConfig: () => Promise<void>;
} | null>(null);

export function FormProvider(props: { children: React.ReactNode }) {
  const [forms, setForms] = useState<FormEntity[]>();

  const [form, setForm] = useState<FormEntity>();
  const [formConfig, setFormConfig] = useState<FormConfig>();

  const fetchForms = (workspaceId: string) => {
    api.form
      .getForms(workspaceId)
      .then((response) => {
        setForms(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const fetchForm = (formId: string) => {
    api.form
      .getForm(formId)
      .then((response) => {
        setForm(response);
        setFormConfig(response.config as FormConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const fetchFormByShortId = (shortId: string) => {
    api.form
      .getFormByShortId(shortId)
      .then((response) => {
        setForm(response);
        setFormConfig(response.config as FormConfig);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

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
    <FormContext.Provider
      value={{
        forms,
        fetchForms,

        form,
        fetchForm,
        fetchFormByShortId,

        formConfig,
        setFormConfig,

        updateFormConfig,
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

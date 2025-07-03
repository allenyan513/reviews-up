import { api } from '@/lib/api-client';
import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity, FormConfig } from '@repo/api/forms';

const FormContext = createContext<{
  forms: FormEntity[] | undefined;
  fetchForms: (workspaceId: string) => void;

  form: FormEntity | undefined;
  fetchForm: (formId: string) => void;
  fetchFormByShortId: (shortId: string) => void;

  formConfig: FormConfig | undefined;
  setFormConfig: (config: FormConfig) => void;

  updateFormConfig: () => Promise<void>;
  deleteForm: (formId: string) => Promise<void>;
  createForm: (workspaceId: string, formName: string) => Promise<void>;
} | null>(null);

export function FormProvider(props: { children: React.ReactNode }) {
  const [forms, setForms] = useState<FormEntity[]>([]);

  const [form, setForm] = useState<FormEntity | undefined>();
  const [formConfig, setFormConfig] = useState<FormConfig | undefined>();

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
    if (!form || !form.id || !formConfig) return;
    try {
      await api.form.updateForm(form.id, {
        config: formConfig,
      });
      toast.success('Form configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update form configuration');
    }
  };
  const deleteForm = async (formId: string) => {
    if (!formId) return;
    try {
      await api.form.deleteForm(formId);
      setForms((prevForms) => prevForms?.filter((f) => f.id !== formId));
      toast.success('Form deleted successfully');
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };
  const createForm = async (workspaceId: string, formName: string) => {
    if (!workspaceId || !formName) {
      toast.error('Please select a workspace first.');
      return;
    }
    try {
      const response = await api.form.createForm({
        workspaceId: workspaceId,
        name: formName,
      });
      setForms((prevForms: any[]) => {
        if (!prevForms) return [response];
        return [...prevForms, response];
      });
      toast.success('Form created successfully!');
    } catch (error) {
      toast.error('Failed to create form. Please try again.');
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
        deleteForm,
        createForm,
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

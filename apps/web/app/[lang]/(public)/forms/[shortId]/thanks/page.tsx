'use client';
import { api } from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PoweredBy from '@/components/powered-by';
import Lottie from 'lottie-react';
import thanks from '@/public/animation/thanks.json';
import { PageParams } from '@/types/page-params';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';

export default function PublicFormThanksRoute(props: {
  params: Promise<PageParams>;
}) {
  const [params, setParams] = useState<PageParams | null>(null);
  const [form, setForm] = useState<FormEntity | null>(null);

  useEffect(() => {
    props.params.then((p) => {
      setParams(p);
      api
        .getFormByShortId(p.shortId, {
          session: null,
        })
        .then((response) => {
          setForm(response);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  }, [props.params]);

  if (!form || !params){
    return null;
  }

  return (
    <PublicFormThanksPage
      mode={'public'}
      lang={params.lang}
      shortId={params.shortId}
      form={form}
      config={form.config as FormConfig}
    />
  );
}

export function PublicFormThanksPage(props: PageParams) {
  const [form, setForm] = useState<FormEntity>();

  useEffect(() => {
    api
      .getFormByShortId(props.shortId, {
        session: null,
      })
      .then((response) => {
        setForm(response);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  if (!form) {
    return null;
  }

  return (
    <div className="flex flex-col items-center pb-32 bg-gray-50">
      <div className="flex flex-col items-center p-8 border rounded-lg shadow-lg m-8 lg:w-3/4 lg:max-w-2xl lg:mx-auto gap-8 bg-white">
        <Lottie animationData={thanks} />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-center">
            {props.config?.thankyou?.title}
          </h2>
          <p className="text-gray-600">{props.config?.thankyou?.message}</p>
        </div>
      </div>
      <PoweredBy />
    </div>
  );
}

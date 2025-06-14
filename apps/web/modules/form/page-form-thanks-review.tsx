'use client';
import Lottie from 'lottie-react';
import thanks from '@/public/animation/thanks.json';
import PoweredBy from '@/components/powered-by';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';

export function PageFormThanksReview(props: {
  mode: 'edit' | 'public';
  formConfig: FormConfig | undefined;
}) {
  const { mode, formConfig } = props;
  if (!formConfig) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 h-[760px]">
      <div className="flex flex-col items-center p-8 border rounded-lg shadow-lg m-8 lg:w-3/4 lg:max-w-2xl lg:mx-auto gap-8 bg-white">
        <Lottie animationData={thanks} />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-center">
            {formConfig.thankyou?.title}
          </h2>
          <p className="text-gray-600">{formConfig.thankyou?.message}</p>
        </div>
      </div>
      <PoweredBy />
    </div>
  );
}

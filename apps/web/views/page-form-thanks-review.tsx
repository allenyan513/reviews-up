import { PageParams } from '@/types/page-params';
import Lottie from 'lottie-react';
import thanks from '@/public/animation/thanks.json';
import PoweredBy from '@/components/powered-by';


export function PageFormThanksReview(props: PageParams) {
  if (!props.form || !props.config) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 h-screen">
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

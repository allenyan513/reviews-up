import React from 'react';
import clsx from 'clsx';
import { BsCheckCircle, BsClock ,
  BsXCircle, BsBan,
} from 'react-icons/bs';

// 可扩展状态顺序
const statusSteps = [
  // 'waitingForAdminReview',
  'pendingForSubmit',
  'pendingForReceive',
  'listing',
] as const;

export type StatusStep = (typeof statusSteps)[number] | 'rejected';

// 状态标签映射（可自定义为中文或其他语言）
const statusLabels: Record<StatusStep, string> = {
  // waitingForAdminReview: 'Pending for Admin Review',
  pendingForSubmit: 'Writing for Submit',
  pendingForReceive: 'Pending',
  listing: 'Public',
  rejected: 'Rejected',
};

interface ProductStatusFlowProps {
  status: StatusStep;
  labels?: Partial<Record<StatusStep, string>>; // 支持自定义 label
}

const ProductStatusFlow: React.FC<ProductStatusFlowProps> = ({
  status,
  labels = {},
}) => {
  const mergedLabels = { ...statusLabels, ...labels };
  const isRejected = status === 'rejected';

  const getStepState = (
    step: StatusStep,
  ): 'success' | 'fail' | 'hidden' | 'current' => {
    if (isRejected) {
      // if (step === 'waitingForAdminReview') return 'success';
      return 'hidden';
    }

    // @ts-ignore
    const currentIndex = statusSteps.indexOf(status as StatusStep);
    // @ts-ignore
    const stepIndex = statusSteps.indexOf(step);

    //如果currentIndex是最后一个状态，则全部都是 success
    if (currentIndex === statusSteps.length - 1) {
      return 'success'
    }

    if (stepIndex === -1) return 'hidden';
    if (stepIndex === currentIndex) return 'current';
    if (stepIndex <= currentIndex) return 'success';
    if (stepIndex > currentIndex) return 'fail';
    return 'hidden';
  };

  return (
    <div className="flex flex-col gap-3 items-start flex-wrap">
      {statusSteps.map((step) => {
        const stepState = getStepState(step);
        if (stepState === 'hidden') return null;

        let Icon = null;
        if (stepState === 'success') {
          Icon = <BsCheckCircle className="w-5 h-5 text-green-500" />;
        } else if (stepState === 'fail') {
          Icon = <BsBan className="w-5 h-5 text-gray-500" />;
        } else if (stepState === 'current') {
          Icon = <BsClock className="w-5 h-5 text-amber-500" />;
        }

        return (
          <div key={step} className="flex items-center gap-1">
            {Icon}
            <span
              className={clsx(
                'text-sm',
                // stepState === 'success' ? 'text-green-600' : 'text-amber-500',
                stepState === 'success'
                  ? 'text-green-600'
                  : stepState === 'fail'
                  ? 'text-gray-500'
                  : stepState === 'current'
                  ? 'text-amber-500'
                  : 'text-gray-400',
              )}
            >
              {mergedLabels[step]}
            </span>
          </div>
        );
      })}

      {isRejected && (
        <div className="flex items-center gap-1">
          <BsXCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-600">{mergedLabels.rejected}</span>
        </div>
      )}
    </div>
  );
};

export default ProductStatusFlow;

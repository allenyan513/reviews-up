import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api-client';
import { BiPlus } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { CreateReviewDto } from '@reviewsup/api/reviews';
import { ReviewImportTiktokDialog } from '@/modules/review/tiktok';
import { ReviewImportXDialog } from '@/modules/review/twitter';
import { ReviewImportGoogleMapDialog } from '@/modules/review/google';
import { ImportLinkedInDialog } from '@/modules/review/linkedin';
import { ManualImportView } from '@/modules/review/manual/manual-import-view';

/**
 * 从 /forms/[shortId] 提交的表单
 * @param props
 * @constructor
 */
export function FormDefaultSubmitView(props: {
  id: string;
  workspaceId: string;
  lang: string;
  shortId: string;
  mode: 'edit' | 'public';
}) {
  const router = useRouter();
  const { id, workspaceId, lang, shortId, mode } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAddReviewManually, setIsAddReviewManually] = useState<boolean>(false);
  const [submitForm, setSubmitForm] = useState<CreateReviewDto | undefined>(
    undefined,
  );

  const handleSubmit = () => {
    if (mode === 'edit') {
      return;
    }
    if (!submitForm) {
      toast.error('Please fill out the form before submitting.');
      return;
    }
    setIsSubmitting(true);
    api.review
      .submitReview({
        workspaceId: workspaceId,
        ...submitForm,
      })
      .then(() => {
        toast.success('Review submitted successfully!');
        setIsSubmitting(false);
        router.push(`/${lang}/forms/${shortId}/thanks`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div className="flex flex-col items-center gap-4 w-full">
        <label className="text-start w-full text-gray-500">
          Import Review from Third Platform:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <ReviewImportXDialog
            workspaceId={workspaceId}
            onImportStart={() => {
              setIsSubmitting(true);
            }}
            onImportSuccess={() => {
              toast.success('Review imported successfully from Twitter!');
              setIsSubmitting(false);
              router.push(`/${lang}/forms/${shortId}/thanks`);
            }}
            onImportFailed={(error) => {
              toast.error(error.message);
              setIsSubmitting(false);
            }}
          />
          <ReviewImportTiktokDialog
            workspaceId={workspaceId}
            onImportStart={() => {
              setIsSubmitting(true);
            }}
            onImportSuccess={() => {
              toast.success('Review imported successfully from Twitter!');
              setIsSubmitting(false);
              router.push(`/${lang}/forms/${shortId}/thanks`);
            }}
            onImportFailed={(error) => {
              toast.error(error.message);
              setIsSubmitting(false);
            }}
          />
          <ReviewImportGoogleMapDialog
            workspaceId={workspaceId}
            onImportStart={() => {
              setIsSubmitting(true);
            }}
            onImportSuccess={() => {
              toast.success('Review imported successfully from Twitter!');
              setIsSubmitting(false);
              router.push(`/${lang}/forms/${shortId}/thanks`);
            }}
            onImportFailed={(error) => {
              toast.error(error.message);
              setIsSubmitting(false);
            }}
          />
          <ImportLinkedInDialog
            workspaceId={workspaceId}
            onImportStart={() => {
              setIsSubmitting(true);
            }}
            onImportSuccess={() => {
              toast.success('Review imported successfully from Twitter!');
              setIsSubmitting(false);
              router.push(`/${lang}/forms/${shortId}/thanks`);
            }}
            onImportFailed={(error) => {
              toast.error(error.message);
              setIsSubmitting(false);
            }}
          />
        </div>
      </div>

      {/* 横线 中间一个文本 'or'  */}
      <div className="flex items-center w-full">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <label className="text-start w-full text-gray-500">
        Add Review Manually:
      </label>
      {isAddReviewManually ? (
        <>
          <ManualImportView formData={submitForm} setFormData={setSubmitForm} />
          <div>
            <Button
              disabled={isSubmitting || !submitForm}
              type="submit"
              onClick={handleSubmit}
              size={'lg'}
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        <Button
          size={'lg'}
          className="w-full items-center justify-center text-sm"
          variant="default"
          onClick={() => {
            setIsAddReviewManually(true);
          }}
        >
          <BiPlus /> Add Review Manually
        </Button>
      )}
    </div>
  );
}

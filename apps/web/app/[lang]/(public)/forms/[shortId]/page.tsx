'use client';
import { api } from '@/lib/apiClient';
import { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FormEntity } from '@repo/api/forms/entities/form.entity';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/review-import-manual-dialog/star-rating';
import { BiImage, BiLogoGoogle, BiLogoTwitter, BiVideo } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import PoweredBy from '@/components/powered-by';
import { PageParams } from '@/types/page-params';
import { FormConfig } from '@repo/api/forms/entities/form-config.entity';
import { useRouter } from 'next/navigation';

export default function PublicFormRoute(props: {
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

  if (!form || !params) {
    return null;
  }

  return (
    <PublicFormPage
      mode={'public'}
      lang={params.lang}
      shortId={params.shortId}
      form={form}
      config={form.config as FormConfig}
    />
  );
}

export function PublicFormPage(props: PageParams) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState<{
    rating: number;
    message: string;
    fullName: string;
    email: string;
  }>({
    rating: 0,
    message: '',
    fullName: '',
    email: '',
  });

  const handleSubmit = () => {
    if (props.mode === 'edit') {
      return;
    }
    api
      .submitReview(
        {
          workspaceId: props.form.workspaceId,
          formId: props.form.id,
          rating: submitForm.rating,
          text: submitForm.message,
          reviewerName: submitForm.fullName,
          reviewerEmail: submitForm.email,
          reviewerImage: '',
          source: 'manual',
        },
        {
          session: null, // Adjust session handling as needed
        },
      )
      .then(() => {
        toast.success('Review submitted successfully!');
        setSubmitForm({
          rating: 0,
          message: '',
          fullName: '',
          email: '',
        });
        router.push(`/${props.lang}/forms/${props.shortId}/thanks`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex flex-col items-center pb-32 bg-gray-50">
      <div className="flex flex-col items-center p-8 border rounded-lg shadow-lg m-8 lg:w-3/4 lg:max-w-2xl lg:mx-auto gap-8 bg-white">
        <div className="flex flex-row gap-4 w-full justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="size-16 shadow-md border rounded-full">
              <AvatarImage
                src={props.config?.brand?.logo || ''}
                alt={props.config?.brand?.name || 'Reviewer'}
              />
              <AvatarFallback className="AvatarFallback" delayMs={600}>
                {props.config?.brand?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">
                {props.config?.brand?.name}
              </h1>
              <p className="text-gray-600">{props.config?.brand?.slogan}</p>
            </div>
          </div>
          <Button size={'lg'}>Visit</Button>
        </div>
        <div className={'divider border-gray-200 w-full border-t'}></div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-center">
            {props.config?.welcome?.title}
          </h2>
          <p className="text-gray-600">{props.config?.welcome?.message}</p>
        </div>
        <StarRating
          size={'lg'}
          value={submitForm.rating}
          onChange={(value) => setSubmitForm({ ...submitForm, rating: value })}
        />
        {/*write your feedback here*/}
        <div className="flex flex-col items-center gap-2 w-full">
          <textarea
            className="w-full p-4 border rounded-lg shadow-sm"
            placeholder="Write your feedback here..."
            rows={4}
            value={submitForm.message}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, message: e.target.value })
            }
          ></textarea>
          <label className="text-sm">Add a photo or video to your review</label>
          <div className="flex flex-row items-center gap-2">
            <BiImage className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
            <BiVideo className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
            <BiLogoTwitter className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
            <BiLogoGoogle className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
          </div>
        </div>

        {/*fullname and email*/}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm">
            Full Name <span className="text-red-500">*</span>
            <span className="ml-4 underline text-blue-500 cursor-pointer">
              SignIn to fullfil it
            </span>
          </label>
          <input
            type="text"
            placeholder="e.g. John Smith"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.fullName}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, fullName: e.target.value })
            }
          />
          <label className="text-sm mt-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. john.smith@gmail.com"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.email}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, email: e.target.value })
            }
          />
        </div>
        <div>
          <Button type="submit" onClick={handleSubmit} size={'lg'}>
            Submit
          </Button>
        </div>
      </div>
      <PoweredBy />
    </div>
  );
}

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api-client';
import StarRating from '@repo/ui/star-rating';
import { UploadContainer } from '@/components/upload-container';
import { BiImage, BiLogoTwitter, BiVideo } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { ReviewSource } from '@repo/database/generated/client';
import { Required } from '@/components/required';
import AvatarUpload from '@/modules/review/manual/avatar-upload';
import ReviewImportXDialog from '../../review/twitter';
import { BsGoogle, BsInstagram, BsTiktok, BsTwitterX } from 'react-icons/bs';
import { useSession, useUserContext } from '@/context/UserProvider';
import { parseTweet } from '@/lib/utils';

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
  reviewSource: ReviewSource | null;
  initValue: {
    rating: number;
    message: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    userUrl: string;
    imageUrls: string[];
    videoUrl: string;
    twitterId: string;
    reviewerId?: string;
  };
}) {
  const router = useRouter();
  const { signIn } = useUserContext();
  const { user } = useSession({
    required: false,
  });
  const { id, workspaceId, lang, shortId, mode, initValue } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [submitForm, setSubmitForm] = useState<{
    rating: number;
    message: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    userUrl: string;
    imageUrls: string[];
    videoUrl: string;
    twitterId: string;
    reviewerId?: string;
  }>({
    rating: initValue.rating,
    message: initValue.message,
    fullName: initValue.fullName,
    email: initValue.email,
    avatarUrl: initValue.avatarUrl,
    userUrl: initValue.userUrl,
    imageUrls: initValue.imageUrls || [],
    videoUrl: initValue.videoUrl || '',
    twitterId: initValue.twitterId || '',
    reviewerId: initValue.reviewerId || '',
  });

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
      .createReview({
        workspaceId: workspaceId,
        formId: id,
        rating: submitForm.rating,
        message: submitForm.message,
        fullName: submitForm.fullName,
        email: submitForm.email,
        userUrl: submitForm.userUrl,
        avatarUrl: submitForm.avatarUrl,
        imageUrls: submitForm.imageUrls,
        videoUrl: submitForm.videoUrl,
        tweetId: submitForm.twitterId,
        reviewerId: submitForm.reviewerId,
      })
      .then(() => {
        setIsSubmitting(false);
        toast.success('Review submitted successfully!');
        router.push(`/${lang}/forms/${shortId}/thanks`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <StarRating
        size={'lg'}
        value={submitForm.rating}
        onChange={(value) => setSubmitForm({ ...submitForm, rating: value })}
      />

      {/*import review from social media*/}
      <div className="flex flex-col items-center gap-4 w-full">
        <label className="font-semibold">
          Import Review from Social Media:
        </label>
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          <ReviewImportXDialog
            onImport={(tweetId, data) => {
              if (!user) {
                signIn();
                return;
              }
              const parseData = parseTweet(data);
              setSubmitForm({
                rating: 5,
                message: parseData?.message || '',
                fullName: parseData?.fullName || '',
                email: parseData?.email || '',
                userUrl: parseData?.userUrl || '',
                avatarUrl: parseData?.avatarUrl || '',
                imageUrls: parseData?.imageUrls || [],
                videoUrl: parseData?.videoUrl || '',
                twitterId: parseData?.tweetId || '',
                reviewerId: user?.id,
              });
              // setReviewSource(ReviewSource.twitter);
            }}
          >
            <Button variant="outline">
              <BsTwitterX />
            </Button>
          </ReviewImportXDialog>
          <Button variant="outline">
            <BsTiktok />
          </Button>
          <Button variant="outline">
            <BsGoogle />
          </Button>
          <Button variant="outline">
            <BsInstagram />
          </Button>
        </div>
      </div>

      {/* 横线 中间一个文本 'or'  */}
      <div className="flex items-center w-full">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* 用户信息表单 */}
      <label className="text-center w-full font-semibold">
        Manually Add a Review:
      </label>
      <div className="grid grid-cols-2 gap-4 w-full">
        <div>
          <label className="text-sm">
            Full Name <Required />
          </label>
          <input
            type="text"
            placeholder="John Smith"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.fullName}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm mt-2">Email</label>
          <input
            type="email"
            placeholder="john.smith@gmail.com"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.email}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm mt-2">Tagline</label>
          <input
            type="text"
            placeholder="Software Engineer at ABC Corp"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.email}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm mt-2">Link</label>
          <input
            type="url"
            placeholder="https://john.smith.com"
            className="w-full p-4 border rounded-lg shadow-sm"
            value={submitForm.userUrl}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, userUrl: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm mt-2">Avatar</label>
          <AvatarUpload
            value={submitForm.avatarUrl}
            onChange={(value) => {
              setSubmitForm({
                ...submitForm,
                avatarUrl: value,
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full pb-8">
        <textarea
          className="w-full p-4 border rounded-lg shadow-sm"
          value={submitForm.message}
          onChange={(e) =>
            setSubmitForm({ ...submitForm, message: e.target.value })
          }
          rows={5}
          placeholder="Write your feedback here..."
        />
        <div className="flex flex-row justify-start w-full gap-2">
          {submitForm.imageUrls.map((item, index) => (
            <img
              key={index}
              src={item}
              alt={`Uploaded image ${index + 1}`}
              className="w-24 h-24 object-cover rounded shadow-sm"
            />
          ))}
        </div>
        {submitForm.videoUrl && (
          <video
            src={submitForm.videoUrl}
            controls
            className="w-full rounded shadow-sm"
          />
        )}
        {/*{submitForm.twitterId && <Tweet id={submitForm.twitterId} />}*/}
        <div className="flex flex-row items-start w-full gap-2">
          <UploadContainer
            accept={'image/*'}
            onUploadSuccess={(url) => {
              setSubmitForm((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, url],
              }));
            }}
          >
            <BiImage className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
          </UploadContainer>
          <UploadContainer
            accept={'video/*'}
            onUploadSuccess={(url) => {
              setSubmitForm((prev) => ({
                ...prev,
                videoUrl: url,
              }));
            }}
          >
            <BiVideo className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
          </UploadContainer>
        </div>
      </div>

      <div>
        <Button
          disabled={isSubmitting}
          type="submit"
          onClick={handleSubmit}
          size={'lg'}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

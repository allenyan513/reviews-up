import { PageParams } from '@/types/page-params';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/apiClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/review-import-manual-dialog/star-rating';
import { Tweet } from 'react-tweet';
import { UploadContainer } from '@/components/upload-container';
import { BiImage, BiLogoTwitter, BiVideo } from 'react-icons/bi';
import ReviewImportXDialog from '@/components/review-x-dialog';
import PoweredBy from '@/components/powered-by';

export function PageFormReview(props: PageParams) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState<{
    rating: number;
    message: string;
    fullName: string;
    email: string;
    imageUrls: string[];
    videoUrl: string;
    twitterId: string;
  }>({
    rating: 0,
    message: '',
    fullName: '',
    email: '',
    imageUrls: [],
    videoUrl: '',
    twitterId: '',
  });

  const handleSubmit = () => {
    if (props.mode === 'edit') {
      return;
    }
    if (!submitForm) {
      toast.error('Please fill out the form before submitting.');
      return;
    }
    api
      .submitReview(
        {
          workspaceId: props.form.workspaceId,
          formId: props.form.id,
          rating: submitForm.rating,
          message: submitForm.message,
          fullName: submitForm.fullName,
          email: submitForm.email,
          imageUrls: submitForm.imageUrls,
          videoUrl: submitForm.videoUrl,
          tweetId: submitForm.twitterId,
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
          imageUrls: [],
          videoUrl: '',
          twitterId: '',
        });
        router.push(`/${props.lang}/forms/${props.shortId}/thanks`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 pb-32">
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
          <Button
            onClick={() => {
              window.open(props.config?.brand?.url, '_blank');
            }}
            size={'lg'}
          >
            Visit
          </Button>
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
        <div className="flex flex-col items-center gap-4 w-full pb-8">
          <textarea
            className="w-full p-4 border rounded-lg shadow-sm"
            placeholder="Write your feedback here..."
            rows={4}
            value={submitForm.message}
            onChange={(e) =>
              setSubmitForm({ ...submitForm, message: e.target.value })
            }
          ></textarea>
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
          {submitForm.twitterId && <Tweet id={submitForm.twitterId} />}
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
            <ReviewImportXDialog
              onImport={(tweetId) => {
                setSubmitForm((prev) => ({
                  ...prev,
                  twitterId: tweetId,
                }));
              }}
            >
              <BiLogoTwitter className="text-5xl border p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors" />
            </ReviewImportXDialog>
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

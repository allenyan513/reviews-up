import {useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import ReviewImportXDialog from '../review/twitter';
import PoweredBy from '@/components/powered-by';
import {useFormContext} from '@/modules/form/context/FormProvider';
import {Divider} from '@/components/divider';
import {BsTwitterX} from 'react-icons/bs';
import {$Enums} from '@repo/database/generated/client';
import ReviewSource = $Enums.ReviewSource;
import {SubmitForm} from '@/modules/form/submit-form';
import {parseTweet} from '@/lib/utils';
import {useSession, useUserContext} from "@/context/UserProvider";

/**
 *
 * @param props
 * @constructor
 */
export function PageFormReview(props: {
  id: string;
  workspaceId: string;
  lang: string;
  shortId: string;
  mode: 'edit' | 'public';
  className?: string;
}) {
  const {id, workspaceId, lang, shortId, mode, className} = props;
  const {signIn} = useUserContext();
  const {user} = useSession({
    required: false
  })
  const {formConfig} = useFormContext();
  const [reviewSource, setReviewSource] = useState<ReviewSource | null>(null);
  const [initValue, setInitValue] = useState<{
    rating: number;
    message: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    userUrl: string;
    imageUrls: string[];
    videoUrl: string;
    twitterId: string;
    source?: ReviewSource;
    reviewerId?: string;
  }>({
    rating: 0,
    message: '',
    fullName: '',
    email: '',
    avatarUrl: '',
    userUrl: '',
    imageUrls: [],
    videoUrl: '',
    twitterId: '',
    reviewerId: user?.id || '',
  });

  useEffect(() => {
    if (!user) return
    setInitValue((prev) => ({
      ...prev,
      reviewerId: user?.id || '',
    }));
  }, [user])


  if (!formConfig || !formConfig.brand || !formConfig.welcome) {
    return null;
  }

  const {brand, welcome} = formConfig;

  return (
    <div className={className}>
      <div
        className="flex flex-col items-center p-8 border rounded-lg shadow-lg m-8 lg:w-3/4 lg:max-w-2xl lg:mx-auto gap-8 bg-white">
        <div className="flex flex-row gap-4 w-full justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="size-16 shadow-md border rounded-full">
              <AvatarImage src={brand.logo} alt={brand.name}/>
              <AvatarFallback className="AvatarFallback" delayMs={600}>
                {brand.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">{brand.name}</h1>
              <p className="text-gray-600">{brand.slogan}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.open(brand.url, '_blank');
            }}
            size={'lg'}
          >
            Visit
          </Button>
        </div>
        <Divider/>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-center">{welcome.title}</h2>
          <p className="text-gray-600">{welcome.message}</p>
        </div>

        {!reviewSource && (
          <div className="flex flex-col gap-2 w-full">
            <ReviewImportXDialog
              beforeOnOpenChange={() => {
                if (!user) {
                  signIn()
                  return false;
                }
                return true;
              }}
              onImport={(tweetId, data) => {
                if (!user) {
                  signIn()
                  return;
                }
                const parseData = parseTweet(data);
                setInitValue({
                  rating: 5,
                  message: parseData?.message || '',
                  fullName: parseData?.fullName || '',
                  email: parseData?.email || '',
                  userUrl: parseData?.userUrl || '',
                  avatarUrl: parseData?.avatarUrl || '',
                  imageUrls: parseData?.imageUrls || [],
                  videoUrl: parseData?.videoUrl || '',
                  twitterId: parseData?.tweetId || '',
                  source: ReviewSource.twitter,
                  reviewerId: user.id,
                });
                setReviewSource(ReviewSource.twitter);
              }}
            >
              <Button
                className="w-full"
                variant="default"
                size={'lg'}>
                Import from
                <span>
                  <BsTwitterX/>
                </span>
              </Button>
            </ReviewImportXDialog>

            <Button
              onClick={() => {
                if (!user) {
                  signIn()
                  return;
                }
                setReviewSource(ReviewSource.manual);
              }}
              className="w-full"
              variant="outline"
              size={'lg'}>
              Manual
            </Button>
          </div>
        )}

        {reviewSource && (
          <SubmitForm
            id={id}
            workspaceId={workspaceId}
            lang={lang}
            shortId={shortId}
            mode={mode}
            reviewSource={reviewSource}
            initValue={initValue}
          />
        )}

        {reviewSource && (
          <Button
            onClick={() => {
              setReviewSource(null);
              setInitValue({
                rating: 0,
                message: '',
                fullName: '',
                email: '',
                avatarUrl: '',
                userUrl: '',
                imageUrls: [],
                videoUrl: '',
                twitterId: '',
                reviewerId: user?.id || '',
              });
            }}
            variant={'ghost'}>
            Back
          </Button>
        )}
      </div>
      <PoweredBy/>
    </div>
  );
}

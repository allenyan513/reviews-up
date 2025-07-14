import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PoweredBy } from '@reviewsup/embed-react';
import { useFormContext } from '@/modules/form/context/FormProvider';
import { Divider } from '@/components/divider';
import { FormDefaultSubmitView } from '@/modules/form/default/form-default-submit-view';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSession, useUserContext } from '@/context/UserProvider';
import { ReviewsupAvatar } from '@reviewsup/ui/reviewsup-avatar';
import Link from 'next/link';

/**
 *
 * @param props
 * @constructor
 */
export function FormDefaultPreviewView(props: {
  id: string;
  workspaceId: string;
  lang: string;
  shortId: string;
  mode: 'edit' | 'public';
  className?: string;
}) {
  const { id, workspaceId, lang, shortId, mode, className } = props;
  const { formConfig } = useFormContext();
  const { signIn } = useUserContext();
  const { user } = useSession({
    required: false,
  });
  if (
    !id ||
    !workspaceId ||
    !shortId ||
    !formConfig ||
    !formConfig.brand ||
    !formConfig.welcome
  ) {
    return null;
  }
  const { brand, welcome } = formConfig;

  return (
    <div className={className}>
      <div className="flex flex-row gap-2 items-center text-sm text-gray-600 w-full lg:max-w-2xl lg:mx-auto">
        {user ? (
          <p className="bg-gray-50 border p-2 rounded-md mb-2">
            {user?.name} is submitting
          </p>
        ) : (
          <p className="bg-gray-50 border p-2 rounded-md mb-2">
            Anonymous is submitting or{' '}
            {/*<Link href="/auth/signin" className="text-blue-500 hover:underline">*/}
            {/*  login*/}
            {/*</Link>*/}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => {
                signIn();
              }}
            >
              Sign in
            </span>
          </p>
        )}
      </div>
      <div className="flex flex-col items-center p-8 border rounded-lg shadow-lg lg:max-w-2xl lg:mx-auto gap-8 bg-white">
        {/*<div className="flex flex-col md:flex-row gap-4 w-full justify-between items-center">*/}
        {/*  <div className="flex flex-row items-center gap-4">*/}
        {/*    <Avatar className="size-16 shadow-md border rounded-full">*/}
        {/*      <AvatarImage src={brand.logo} alt={brand.name} />*/}
        {/*      <AvatarFallback className="AvatarFallback" delayMs={600}>*/}
        {/*        {brand.name?.charAt(0).toUpperCase() || 'U'}*/}
        {/*      </AvatarFallback>*/}
        {/*    </Avatar>*/}
        {/*    <div className="flex flex-col gap-1">*/}
        {/*      <h1 className="text-2xl font-bold">{brand.name}</h1>*/}
        {/*      <p className="text-gray-600">{brand.slogan}</p>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <Button*/}
        {/*    onClick={() => {*/}
        {/*      window.open(brand.url, '_blank');*/}
        {/*    }}*/}
        {/*    size={'lg'}*/}
        {/*    className="w-full md:w-auto"*/}
        {/*  >*/}
        {/*    Visit*/}
        {/*  </Button>*/}
        {/*</div>*/}
        {/*<Divider />*/}

        <div className="flex flex-col gap-4 rich-text">
          <h2 className="text-xl font-semibold text-center">{welcome.title}</h2>
          <Markdown children={welcome?.message} remarkPlugins={[remarkGfm]} />
        </div>
        <FormDefaultSubmitView
          id={id}
          workspaceId={workspaceId}
          lang={lang}
          shortId={shortId}
          mode={mode}
        />
      </div>
      <PoweredBy className="py-8" />
    </div>
  );
}

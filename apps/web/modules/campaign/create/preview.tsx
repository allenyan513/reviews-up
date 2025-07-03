import { Divider } from '@/components/divider';
import { Button, buttonVariants } from '@/components/ui/button';
import { useCampaignContext } from '@/modules/campaign/context/campaign-provider';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { CampaignEntity } from '@repo/api/campaign/index';
import { PoweredBy } from '@reviewsup/embed-react';

export function CampaignCreatePreviewPage(props: {
  data?: CampaignEntity;
  mode?: 'view' | 'create';
}) {
  const { data, mode } = props;
  const { submitForm } = useCampaignContext();

  if (!submitForm) return null;

  const isViewMode = mode === 'view';

  const from = isViewMode
    ? `${data?.fromName} <${data?.fromEmail}>`
    : `${submitForm.fromName} <${submitForm.fromEmail}>`;
  const to = isViewMode ? data?.toEmails || [] : submitForm.toEmails || [];
  const subject = isViewMode ? data?.subject : submitForm.subject;
  const content = isViewMode ? data?.content : submitForm.content;
  const formShortId = isViewMode ? data?.formShortId : submitForm.formShortId;
  const buttonText = isViewMode ? data?.buttonText : submitForm.buttonText;

  return (
    <>
      <div className="w-full border border-gray-200 rounded-md bg-gray-100 p-8">
        <div className="space-y-2  p-4 bg-white rounded-t-md">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-start gap-2">
              <span className="w-16">From:</span>{' '}
              <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-800">
                {from}
              </span>
            </div>
            <Divider />
            <div className="flex flex-row items-start gap-2">
              <span className="w-16">To:</span>
              <div className="flex flex-col gap-2 mt-1">
                {to.map((email, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-800"
                  >
                    {email}
                  </span>
                ))}
              </div>
            </div>
            <Divider />
            <div className="flex flex-row items-start gap-2">
              <span className="w-16">Subject:</span> <span>{subject}</span>
            </div>
            <Divider />
          </div>
        </div>

        {/* Email Content */}
        <div className="flex flex-col w-full gap-4 p-8 items-center text-center bg-white rounded-b-md">
          <div className="rich-text text-start">
            <Markdown children={content} remarkPlugins={[remarkGfm]} />
          </div>
          <Link
            target="_blank"
            href={`/forms/${formShortId}`}
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
            })}
          >
            {buttonText}
          </Link>
          <PoweredBy className="py-2" />
        </div>
      </div>
    </>
  );
}

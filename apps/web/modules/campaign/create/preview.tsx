import {Divider} from "@/components/divider";
import {Button, buttonVariants} from "@/components/ui/button"
import {useCampaignContext} from "@/modules/campaign/context/campaign-provider";
import PoweredBy from "@/components/powered-by";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Logo} from "@/components/logo";
import Link from "next/link";

export function CampaignCreatePreviewPage() {
  const {submitForm} = useCampaignContext()

  if (!submitForm) return null;

  return (
    <>
      <div className="w-full border border-gray-200 rounded-md bg-gray-100 p-8">
        <div className="space-y-2  p-4 bg-white rounded-t-md">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row items-start gap-2">
              <span className='w-16'>From:</span>{' '}
              <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-800">
                {submitForm.fromName} &lt;{submitForm.fromEmail}&gt;
              </span>
            </div>
            <Divider/>
            <div className='flex flex-row items-start gap-2'>
              <span className='w-16'>To:</span>
              <div className='flex flex-col gap-2 mt-1'>
                {submitForm.toEmails && submitForm.toEmails.length > 0 && submitForm.toEmails.map((email, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-800">
                  {email}
                </span>
                ))}
              </div>
            </div>
            <Divider/>
            <div className='flex flex-row items-start gap-2'>
              <span className='w-16'>Subject:</span>{' '}
              <span>{submitForm.subject}</span>
            </div>
            <Divider/>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex flex-col w-full gap-4 p-8 items-center text-center bg-white rounded-b-md">
          <div className="rich-text text-start">
            <Markdown
              children={submitForm.content || ''}
              remarkPlugins={[remarkGfm]}/>
          </div>
          <Link
            target="_blank"
            href={`/forms/${submitForm.formId}`}
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
            })}>
            {submitForm.buttonText}
          </Link>
          <PoweredBy className='py-2'/>
        </div>
      </div>
    </>
  )
}

import Link from 'next/link';
import { cn } from '@repo/ui/lib/utils';
import { buttonVariants } from '@repo/ui/button';

export function CollectingForm(props: {
  title: string;
  subtitle: string;
  formId: string;
}) {
  const { title, subtitle, formId } = props;

  return (
    <section
      id="collecting-form"
      className="max-w-5xl px-4 flex flex-col items-center w-full"
    >
      <h2 className="w-full text-center text-4xl pb-4 font-semibold">
        {title}
      </h2>
      <h3 className="text-muted-foreground sm:text-lg text-center pb-8">
        {subtitle}
      </h3>
      <Link
        href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${formId}`}
        target={'_blank'}
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'lg',
            className: 'w-full max-w-md',
          }),
        )}
      >
        Submit your review
      </Link>
      <iframe
        key={formId}
        id="collecting-form"
        src="http://localhost:5510/en/forms/329b3b9f3ee"
        className="w-full h-screen mt-8 rounded-lg border border-gray-200"
      />
    </section>
  );
}

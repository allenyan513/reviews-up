import { Showcase, ShowcaseLoading } from '@reviewsup/embed-react';
import Link from 'next/link';

export function ShowcaseWrapper(props: {
  title: string;
  subtitle: string;
  formId: string;
  items: {
    title: string;
    showcaseId: string;
  }[];
}) {
  const { items, title, subtitle, formId } = props;

  return (
    <section id="showcase" className="max-w-5xl">
      <h2 className="w-full text-center text-4xl pb-4 font-semibold">
        {title}
      </h2>
      <h3 className="text-muted-foreground sm:text-lg text-center pb-8">
        {subtitle}
        <Link
          href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${formId}`}
          target={'_blank'}
          className="underline text-blue-500 ml-2"
        >
          Submit your review
        </Link>
      </h3>
      <div className="flex flex-col gap-24">
        {items.map((item) => (
          <div key={item.showcaseId}>
            <h3 className="text-muted-foreground sm:text-lg text-center pb-8">
              {item.title}
            </h3>
            <Showcase
              fallback={<ShowcaseLoading />}
              showcaseId={item.showcaseId}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

import {Showcase, ShowcaseLoading} from "@reviewsup/embed-react";
import Link from "next/link";

export function ShowcaseWrapper(props: {
  title: string;
  subtitle: string;
  showcaseId: string;
  formId: string;
}) {
  return (
    <section
      id="showcase"
      className='max-w-5xl px-4'>
      <h2 className='w-full text-center text-4xl pb-4 font-semibold'>{props.title}</h2>
      <h3 className="text-muted-foreground sm:text-lg text-center pb-8">
        {props.subtitle}
        <Link
          href={`${process.env.NEXT_PUBLIC_APP_URL}/forms/${props.formId}`}
          target={'_blank'}
          className='underline text-blue-500 ml-2'>Submit your review</Link>
      </h3>
      <Showcase
        fallback={<ShowcaseLoading/>
        }
        showcaseId={props.showcaseId}/>
    </section>
  )
}

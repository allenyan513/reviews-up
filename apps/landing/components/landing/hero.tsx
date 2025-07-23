import { buttonVariants } from '@reviewsup/ui/button';
import { cn } from '@reviewsup/ui/lib/utils';
import Link from 'next/link';

export function Hero(props: {
  capsuleText: string;
  capsuleLink: string;
  title: string;
  subtitle: string;
  credits?: React.ReactNode;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}) {
  return (
    <section className="pt-24 flex flex-col items-center gap-4 text-center">
      <Link
        href={props.capsuleLink}
        className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
        target="_blank"
      >
        {props.capsuleText}
      </Link>
      <h1 className="text-4xl md:text-6xl w-full font-bold">
        {props.title.split('\n').map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="leading-normal text-muted-foreground text-lg  md:text-xl md:leading-8 whitespace-normal w-full ">
        {props.subtitle.split('\n').map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>
      <div className="flex gap-4 flex-wrap justify-center mt-4">
        <Link
          target="_blank"
          href={props.primaryCtaLink}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-red-400 hover:bg-red-500 rounded-md h-12 text-white font-semibold',
          )}
        >
          {props.primaryCtaText}
        </Link>

        {props.secondaryCtaLink && (
          <Link
            target="_blank"
            href={props.secondaryCtaLink}
            className={cn(
              buttonVariants({ size: 'lg', }),
              'bg-white rounded-md h-12 text-black font-semibold border border-gray-300 hover:bg-gray-100',
            )}
          >
            {props.secondaryCtaText}
          </Link>
        )}
      </div>

      {props.credits && (
        <p className="text-sm text-muted-foreground mt-4">{props.credits}</p>
      )}
    </section>
  );
}

import { cn } from '../lib/utils';

export function PoweredBy(props: { className?: string }) {
  return (
    <a
      className={cn(
        'flex items-center justify-center text-xs text-gray-400',
        props.className,
      )}
      href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
      target="_blank"
    >
      Powered by reviewsup.io
    </a>
  );
}

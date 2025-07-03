import Link from 'next/link';
import clsx from 'clsx';

export function PoweredBy(props: { className?: string }) {
  return (
    <Link
      className={clsx(
        'flex items-center justify-center text-xs text-gray-400',
        props.className,
      )}
      href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
      target="_blank"
    >
      Powered by reviewsup.io
    </Link>
  );
}

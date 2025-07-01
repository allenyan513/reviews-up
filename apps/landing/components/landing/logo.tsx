import { cn } from '@repo/ui/lib/utils';
import Link from 'next/link';

export function Logo(props: {
  websiteLogo?: string;
  websiteName?: string;
  className?: string;
  link?: string;
  isBeta?: boolean;
}) {
  return (
    <Link
      href={props.link ?? '/'}
      className={cn('items-center space-x-2', props.className)}
    >
      <img
        className="w-8 h-8 inline"
        src={props.websiteLogo ?? '/img/logo-32.png'}
        alt="Logo"
      />
      <span className="font-bold sm:inline-block">
        {props.websiteName}
        {props.isBeta && (
          <span className="text-sm text-gray-500 ml-2">(Beta)</span>
        )}
      </span>
    </Link>
  );
}

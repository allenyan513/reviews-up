import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo(props: {
  websiteLogo?: string;
  websiteName?: string;
  className?: string;
  link?: string;
}) {
  return (
    <Link
      href={props.link ?? '/'}
      className={cn('items-center space-x-2', props.className)}
    >
      <img className="w-8 h-8" src={props.websiteLogo ?? '/img/logo-32.png'} alt="Logo" />
      <span className="font-bold sm:inline-block">{props.websiteName}</span>
    </Link>
  );
}

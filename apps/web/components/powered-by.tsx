import clsx from 'clsx';
import Link from 'next/link';
import {cn} from "@repo/ui/lib/utils";

export default function PoweredBy(props: {
  className?: string;
}) {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={cn("flex items-center justify-center text-xs gap-1 text-gray-400", props.className)}>
        <span>Powered by </span>
        {/*<img*/}
        {/*  className="w-4 h-4 ml-2"*/}
        {/*  src="/img/logo-32.png"/>*/}
        <span>Reviewsup.io</span>
      </div>
    </Link>
  );
}

import Link from 'next/link';

export function LinkDoFollow(props: {
  href: string;
  isDoFollow: boolean;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
  refName?: string;
}) {
  const {
    href,
    isDoFollow,
    children,
    isExternal = true,
    className,
    refName = 'reviewsup',
  } = props;
  const refUrl = new URL(href);
  refUrl.searchParams.set('ref', refName);
  const finalUrl = refUrl.toString();
  return (
    <Link
      className={className}
      href={finalUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isDoFollow ? 'noopener' : 'nofollow noopener'}
    >
      {children}
    </Link>
  );
}

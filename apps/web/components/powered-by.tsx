import Link from 'next/link';

export default function PoweredBy() {
  return (
    <Link href="/">
      <div className="flex items-center justify-center text-xs text-muted-foreground gap-2">
        <span>Powered by </span>
        <span>ReviewsUp</span>
      </div>
    </Link>
  );
}

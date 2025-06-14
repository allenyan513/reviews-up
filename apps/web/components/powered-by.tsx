import Link from 'next/link';

export default function PoweredBy() {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center justify-center text-xs gap-1 text-gray-400 py-8">
        <span>Powered by </span>
        <img
          className="w-4 h-4 ml-2"
          src="/img/logo-32.png" />
        <span>reviewsup.io</span>
      </div>
    </Link>
  );
}

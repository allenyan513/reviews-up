import Link from 'next/link';
import clsx from 'clsx';

export function PoweredBy(props: {
  className?: string;
}) {
  return (
    <Link
      href='https://reviewsup.io'
      target="_blank">
      <div
        // className={clsx("flex items-center justify-center text-xs gap-1 text-gray-400 py-8", props.className)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          gap: '0.25rem',
          color: '#9CA3AF', // text-gray-400
          borderRadius: '0.25rem',
          border: '1px solid #E5E7EB', // border-gray-200
        }}
      >
        <span>Powered by </span>
        <img
          className="w-4 h-4 ml-2"
          src="https://reviewsup.io/img/logo-32.png"/>
        <span>Reviewsup.io</span>
      </div>
    </Link>
  );
}

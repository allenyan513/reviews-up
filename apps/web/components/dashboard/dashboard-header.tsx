import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';

export function DashboardHeader(props: {
  title: string;
  subtitle: string;
  url?: string;
  enableBack?: boolean;
  buttons?: React.ReactNode;
}) {
  const { title, subtitle, url, enableBack = false, buttons } = props;
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {enableBack && url ? (
          <Link href={url} className="flex flex-row items-center gap-2 ">
            {enableBack && <BiArrowBack className="text-2xl" />}
            <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
          </Link>
        ) : (
          <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        )}

        <h2 className="mt-1 text-gray-600">{subtitle}</h2>
      </div>
      <div className={'space-x-2'}>{buttons}</div>
    </div>
  );
}

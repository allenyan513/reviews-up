import { i18nLanguages } from '@/config/i18n-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@reviewsup/ui/lib/utils';

export function I18nEntries(props: { className?: string }) {
  const pathname = usePathname();

  function getLocalizedPath(newLang: string) {
    const segments = pathname.split('/');
    segments[1] = newLang;
    return segments.join('/') || '/';
  }

  return (
    <div className="flex flex-col gap-1 text-[16px]">
      <h2 className="uppercase font-semibold">Languages</h2>
      <div className={'flex flex-col gap-2'}>
        {i18nLanguages.map((item) => {
          const href = getLocalizedPath(item.code);
          return (
            <Link
              href={href}
              className="text-gray-500 hover:text-gray-600"
              key={item.name}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

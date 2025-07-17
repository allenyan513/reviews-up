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
    <div
      className={cn(
        'md:flex md:flex-row grid grid-cols-4 gap-1 md:gap-4',
        props.className,
      )}
    >
      {i18nLanguages.map((item) => {
        const href = getLocalizedPath(item.code);
        return (
          <Link href={href} className="flex items-center gap-2" key={item.name}>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

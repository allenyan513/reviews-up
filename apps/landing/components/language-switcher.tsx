'use client';

import {i18nLanguages} from '@/config/i18n-config';
import {usePathname, useRouter} from 'next/navigation';
import {useState} from 'react';
import {BiGlobe} from "react-icons/bi";
import Link from "next/link";

export function LanguageSwitcher(props: {
  lang: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname()

  function getLocalizedPath(newLang: string) {
    const segments = pathname.split('/')
    segments[1] = newLang
    return segments.join('/') || '/'
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center justify-center rounded-md py-2 text-base font-medium text-gray-900 hover:text-purple-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BiGlobe/>
        <span className="ml-2 uppercase">{props.lang}</span>
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1">
            {i18nLanguages.map((lang) => (
              <Link
                key={lang.code}
                href={getLocalizedPath(lang.code)}
                className={`block px-4 py-2 text-sm text-gray-900 hover:text-purple-600 ${
                  props.lang === lang.code ? 'font-semibold text-purple-600' : ''
                }`}
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

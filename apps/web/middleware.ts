import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { i18n } from '@/config/i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (e) {
    // Invalid accept-language header
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  // if (
  //   [
  //     '/manifest.json',
  //     '/favicon.ico',
  //     '/google.png',
  //     '/robots.txt',
  //     '/js/embed.js',
  //     '/img/*',
  //     // Your other files in `public`
  //   ].includes(pathname)
  // )
  //   return;
  const STATIC_FILE_REGEX =
    /^\/(favicon\.ico|manifest\.json|robots\.txt|google\.png|js\/embed\.js|img\/.*)$/;

  if (STATIC_FILE_REGEX.test(pathname)) {
    return;
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale: any) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // e.g. incoming request is /products
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = searchParams.toString();
    // The new URL is now /en-US/products
    return NextResponse.redirect(newUrl);
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  // auth 现在不需要忽略 `/api/`，因为现在不使用 next-auth
  matcher: ['/((?!_next|api).*)'],
};

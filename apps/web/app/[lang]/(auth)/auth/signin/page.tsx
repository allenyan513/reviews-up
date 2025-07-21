'use client';

import { LoginForm } from '@/components/login-form';
import { use } from 'react';
import { Widget } from '@reviewsup/embed-react';

export default function LoginPage(props: {
  params: Promise<{
    lang: string;
  }>;
  searchParams: Promise<{
    redirect?: string;
  }>;
}) {
  const { lang } = use(props.params);
  const { redirect } = use(props.searchParams);
  const widgetIds = (process.env.NEXT_PUBLIC_WIDGET_IDS as string)
    .split(',')
    .map((id) => id.trim());

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src="/img/logo-32.png" alt="Logo" className="h-8 w-auto" />
            ReviewsUp.io
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirect={redirect} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block max-h-screen overflow-y-scroll p-4">
        <Widget id={widgetIds[0] || ''} />
      </div>
    </div>
  );
}

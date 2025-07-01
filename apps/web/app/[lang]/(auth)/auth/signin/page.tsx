'use client';

import { LoginForm } from '@/components/login-form';
import { use } from 'react';

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
      <div className="bg-muted relative hidden lg:block">
        {/*<img*/}
        {/*  src="/img/logo-32.png"*/}
        {/*  alt="Image"*/}
        {/*  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"*/}
        {/*/>*/}
      </div>
    </div>
  );
}

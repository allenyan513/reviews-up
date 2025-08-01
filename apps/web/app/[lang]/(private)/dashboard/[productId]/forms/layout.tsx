'use client';

import { FormProvider } from '@/modules/form/context/FormProvider';

export default function RootLayout(props: { children: React.ReactNode }) {
  return <FormProvider>{props.children}</FormProvider>;
}

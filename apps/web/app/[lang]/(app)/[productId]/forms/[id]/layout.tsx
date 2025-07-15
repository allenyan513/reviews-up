'use client';

import FormIdLayout from '@/modules/form/form-id-layout';

export default function Layout(props: {
  params: Promise<{
    lang: string;
    productId: string;
    id: string;
  }>;
  children: React.ReactNode;
}) {
  return <FormIdLayout params={props.params}>{props.children}</FormIdLayout>;
}

'use client';

import FormDefaultPage from '@/modules/form/default/form-default-page';

export default function Page(props: {
  params: Promise<{
    id: string;
    lang: string;
    productId: string;
  }>;
}) {
  return <FormDefaultPage params={props.params} />;
}

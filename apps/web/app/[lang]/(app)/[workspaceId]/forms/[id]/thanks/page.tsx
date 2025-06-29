'use client';

import FormThanksPage from "@/modules/form/thanks/form-thanks-page";

export default function Page(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
    id: string;
  }>;
}) {
  return <FormThanksPage params={props.params}/>;
}

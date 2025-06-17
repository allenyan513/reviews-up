'use client';
import { BundledLanguage, codeToHtml, ThemeRegistrationAny } from 'shiki';
import { useEffect, useState } from 'react';

export function CodeBlockClient(props: {
  children: string;
  lang: BundledLanguage;
  theme?: ThemeRegistrationAny;
}) {
  const [out, setOut] = useState<string>('');
  useEffect(() => {
    codeToHtml(props.children, {
      lang: props.lang,
      theme: 'one-light'
    })
      .then((result) => {
        setOut(result);
      })
      .catch((error) => {
        console.error('Error generating HTML code:', error);
      });
  }, []);
  return (
    <div className={'text-sm p-4'} dangerouslySetInnerHTML={{ __html: out }} />
  );
}

'use client';
import { BundledLanguage, codeToHtml, ThemeRegistrationAny } from 'shiki';
import { useEffect, useState } from 'react';

export function CodeBlockClient(props: {
  children: string;
  lang: BundledLanguage;
  theme?: ThemeRegistrationAny;
}) {
  const { lang, theme, children } = props;

  const [out, setOut] = useState<string>('');
  useEffect(() => {
    codeToHtml(children, {
      lang: lang,
      theme: 'github-light',
    })
      .then((result) => {
        setOut(result);
      })
      .catch((error) => {
        console.error('Error generating HTML code:', error);
      });
  }, [children]);
  return (
    <div className={'text-sm'} dangerouslySetInnerHTML={{ __html: out }} />
  );
}

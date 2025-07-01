import { BundledLanguage, codeToHtml, ThemeRegistrationAny } from 'shiki';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { BsCopy } from 'react-icons/bs';

export function CodeBlock(props: {
  codes: string[];
  lang: BundledLanguage;
  theme?: ThemeRegistrationAny;
}) {
  const { codes, lang, theme = 'one-light' } = props;
  const [out, setOut] = useState<string>('');
  useEffect(() => {
    codeToHtml(codes.join('\n'), {
      lang: lang,
      theme: theme,
    })
      .then((result) => {
        setOut(result);
      })
      .catch((error) => {
        console.error('Error generating HTML code:', error);
      });
  }, []);
  return (
    <div className="relative rounded-md border">
      <Button
        onClick={() => {
          navigator.clipboard.writeText(codes.join('\n'));
          toast.success('Code copied to clipboard!');
        }}
        variant="outline"
        className="absolute top-2 right-2"
      >
        <BsCopy />
      </Button>
      <div
        className={'text-sm p-4 bg-white'}
        dangerouslySetInnerHTML={{ __html: out }}
      />
    </div>
  );
}

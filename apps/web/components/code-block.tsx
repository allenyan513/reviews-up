import { BundledLanguage, codeToHtml } from 'shiki';

export async function CodeBlock(props: { children: string; lang: BundledLanguage }) {
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: 'github-light'
  });
  return <div dangerouslySetInnerHTML={{ __html: out }} />;
}

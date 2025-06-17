import {BundledLanguage, codeToHtml} from 'shiki';

export async function CodeBlock(props: {
  children: string;
  lang: BundledLanguage | string;
  theme?: string
  className?: string;
}) {
  const {children, lang, theme} = props;
  const out = await codeToHtml(props.children, {
    lang: props.lang,
    theme: theme || 'one-light',
  });
  return <div
    className={props.className || 'text-sm rounded-md overflow-x-auto'}
    dangerouslySetInnerHTML={{__html: out}}/>;
}

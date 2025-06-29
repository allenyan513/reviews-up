import SyntaxHighlighter from 'react-syntax-highlighter';

export const CodeHighlighter = (props: {
  code: string;
  language?: string;
  className?: string;
}) => {
  return (
    <div className={props.className}>
      <SyntaxHighlighter
        language={props.language}>
        {props.code}
      </SyntaxHighlighter>
    </div>
  );
};

import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

export const CodeHighlighter = (props: {
  code: string;
  language?: string;
  className?: string;
}) => {
  return (
    <div className={props.className}>
      <SyntaxHighlighter
        language={props.language} style={docco}>
        {props.code}
      </SyntaxHighlighter>
    </div>
  );
};

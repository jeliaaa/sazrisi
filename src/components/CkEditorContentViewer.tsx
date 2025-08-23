import React, { ReactElement } from 'react';
import parse, { DOMNode, Text, HTMLReactParserOptions } from 'html-react-parser';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface CkeditorContentViewerProps {
  html: string;
}

const CkeditorContentViewer: React.FC<CkeditorContentViewerProps> = ({ html }) => {
  if (!html) return null;

  const replaceMath = (text: string): ReactElement | string => {
    const combinedRegex = /\\\((.+?)\\\)|\\\[(.+?)\\\]/g;

    const parts: (ReactElement | string)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const mathContent = match[1] ?? match[2] ?? '';

      try {
        if (match[0].startsWith('\\(')) {
          parts.push(<InlineMath math={mathContent} key={match.index} />);
        } else {
          parts.push(<BlockMath math={mathContent} key={match.index} />);
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error("KaTeX rendering error:", err.message);
        parts.push(text.substring(match.index, combinedRegex.lastIndex));
      }

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // ReactElement instead of generic ReactNode
    return <>{parts}</>;
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'text') {
        const textNode = domNode as Text;
        return replaceMath(textNode.data);
      }
      return undefined;
    },
  };

  return <div>{parse(html, options)}</div>;
};

export default CkeditorContentViewer;

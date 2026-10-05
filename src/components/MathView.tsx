import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [math, block]);

  if (!html) {
    return (
      <span className={`font-mono text-cyan-300 ${block ? 'block text-center py-2' : 'inline'} ${className}`}>
        {math}
      </span>
    );
  }

  return (
    <span
      className={`${block ? 'block text-center my-2 overflow-x-auto' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

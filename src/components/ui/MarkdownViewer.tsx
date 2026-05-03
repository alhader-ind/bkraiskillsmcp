import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import { Components } from 'react-markdown';

interface MarkdownViewerProps {
  content: string;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group rounded-lg overflow-hidden bg-slate-900 border border-slate-800 my-6">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700">
          <span className="text-xs font-medium text-slate-300 font-mono">
            {match[1]}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="p-4 overflow-x-auto text-sm text-slate-50 font-mono leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  }

  return (
    <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono border border-blue-100 before:content-none after:content-none" {...props}>
      {children}
    </code>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const components: Components = {
    code: CodeBlock as any,
    table: ({ node, ...props }) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600 border-collapse" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="px-4 py-3 border-b border-slate-200 whitespace-nowrap" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="px-4 py-3 border-b border-slate-100" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote className="border-l-4 border-blue-500 bg-blue-50/50 py-2 px-5 my-6 text-slate-700 italic rounded-r-lg" {...props} />
    ),
    h1: ({ node, ...props }) => (
      <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight pb-2 border-b border-slate-200" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4 tracking-tight" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-base font-semibold text-slate-900 mt-6 mb-3" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a className="text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-blue-200 hover:decoration-blue-600 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
    )
  };

  return (
    <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-li:marker:text-slate-400">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

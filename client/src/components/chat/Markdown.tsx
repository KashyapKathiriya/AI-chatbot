import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const CodeBlock = ({ inline, className, children }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (inline) {
    return (
      <code className="bg-neutral-800 text-neutral-100 px-1 py-[1px] rounded text-base">
        {children}
      </code>
    );
  }

  return (
    <div className="rounded-md overflow-hidden my-3 border border-neutral-800 bg-[#0b0f19]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400">
        <span>{match?.[1]?.toUpperCase() || "CODE"}</span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-neutral-300 hover:text-white transition"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        style={oneDark}
        language={match?.[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "12px",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

const components = {
  code: CodeBlock,

  // FIX: prevents <p><div> nesting crash
  p: ({ children }: any) => {
    return (
      <div className="my-2 text-base leading-7 text-neutral-100">
        {children}
      </div>
    );
  },

  h1: ({ children }: any) => (
    <h1 className="text-xl font-semibold mt-4 mb-2 text-neutral-100">
      {children}
    </h1>
  ),

  h2: ({ children }: any) => (
    <h2 className="text-lg font-semibold mt-3 mb-2 text-neutral-100">
      {children}
    </h2>
  ),

  h3: ({ children }: any) => (
    <h3 className="text-base font-semibold mt-3 mb-1 text-neutral-100">
      {children}
    </h3>
  ),

  ul: ({ children }: any) => (
    <ul className="list-disc pl-5 my-2 space-y-1 text-neutral-100 text-base">
      {children}
    </ul>
  ),

  ol: ({ children }: any) => (
    <ol className="list-decimal pl-5 my-2 space-y-1 text-neutral-100 text-base">
      {children}
    </ol>
  ),

  li: ({ children }: any) => (
    <li className="leading-7 text-neutral-100 text-base">{children}</li>
  ),

  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-neutral-700 pl-4 my-3 text-neutral-400 italic text-base">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-4 border-neutral-800" />,

  table: ({ children }: any) => (
    <div className="my-4 w-full overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950">
      <div className="min-w-max">
        <table className="w-full border-collapse text-base">{children}</table>
      </div>
    </div>
  ),

  thead: ({ children }: any) => (
    <thead className="bg-neutral-800 text-neutral-200">{children}</thead>
  ),

  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-neutral-800">{children}</tbody>
  ),

  tr: ({ children }: any) => (
    <tr className="hover:bg-neutral-900/40">{children}</tr>
  ),

  th: ({ children }: any) => (
    <th className="sticky top-0 z-10 bg-neutral-800 text-left px-3 py-2 font-semibold text-base border-b border-neutral-700 whitespace-nowrap">
      {children}
    </th>
  ),

  td: ({ children }: any) => (
    <td className="px-3 py-2 text-base whitespace-nowrap text-neutral-100 border-b border-neutral-800">
      {children}
    </td>
  ),
};

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

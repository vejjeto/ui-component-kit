"use client";

import { cn } from "@/lib/cn";
import { type TokenKind, tokenizeCode } from "@/lib/syntax";
import { Check, Copy } from "lucide-react";
import * as React from "react";

const TOKEN_CLASSES: Record<TokenKind, string> = {
  keyword: "text-indigo-400 font-medium",
  string: "text-emerald-400",
  tag: "text-sky-400",
  attr: "text-amber-300",
  comment: "text-zinc-500 italic",
  number: "text-rose-400",
  punct: "text-zinc-400",
  plain: "text-zinc-100",
};

export interface CodeBlockProps {
  code: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  filename = "example.tsx",
  className,
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false);
  const tokens = React.useMemo(() => tokenizeCode(code), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-ui)] border border-[var(--border-subtle)] bg-zinc-950 text-zinc-100",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3.5 py-2">
        <span className="font-mono text-xs text-zinc-400">{filename}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar código"
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <code>
          {tokens.map((token, idx) => (
            <span key={idx} className={TOKEN_CLASSES[token.kind]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

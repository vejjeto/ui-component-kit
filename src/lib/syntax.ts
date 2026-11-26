export type TokenKind =
  | "keyword"
  | "string"
  | "tag"
  | "attr"
  | "comment"
  | "number"
  | "punct"
  | "plain";

export interface CodeToken {
  kind: TokenKind;
  value: string;
}

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "let",
  "function",
  "return",
  "true",
  "false",
  "null",
  "undefined",
  "type",
  "interface",
  "await",
  "async",
  "new",
]);

const TOKEN_PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][a-z0-9-]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[{}()[\].,:;=<>/!?+-]+|\s+)/g;

function classifyToken(raw: string, nextChar: string): TokenKind {
  if (raw.startsWith("//") || raw.startsWith("/*")) return "comment";
  if (raw.startsWith('"') || raw.startsWith("'") || raw.startsWith("`"))
    return "string";
  if (raw.startsWith("<")) return "tag";
  if (/^\d/.test(raw)) return "number";
  if (KEYWORDS.has(raw)) return "keyword";
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(raw)) {
    return nextChar === "=" ? "attr" : "plain";
  }
  if (/^\s+$/.test(raw)) return "plain";
  return "punct";
}

/** Lightweight JSX/TSX tokenizer for dependency-free code preview highlighting. */
export function tokenizeCode(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) {
      tokens.push({ kind: "plain", value: source.slice(lastIndex, idx) });
    }
    const raw = match[0];
    const nextChar = source[idx + raw.length] ?? "";
    tokens.push({ kind: classifyToken(raw, nextChar), value: raw });
    lastIndex = idx + raw.length;
  }

  if (lastIndex < source.length) {
    tokens.push({ kind: "plain", value: source.slice(lastIndex) });
  }

  return tokens;
}

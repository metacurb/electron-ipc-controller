/** True if the type string was truncated by TypeScript (e.g. "... 27 more ..."). */
export const isTruncatedTypeString = (s: string): boolean => /\.\.\.\s+\d+\s+more\s+\.\.\./.test(s);

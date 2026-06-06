export const unwrapSingleParagraph = (value: string) => {
  const match = value.match(/^\s*<p(?:\s[^>]*)?>([\s\S]*)<\/p>\s*$/i);
  if (!match) return value;

  const innerValue = match[1];
  return /<\/?p(?:\s|>)/i.test(innerValue) ? value : innerValue;
};

export const sanitizeRichTextPayload = <T extends object>(payload: T): T => ({
  ...payload,
  ...Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === 'string' ? unwrapSingleParagraph(value) : value,
    ]),
  ),
} as T);

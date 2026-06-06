export const getPlainViewText = (value: unknown) => String(value ?? '')
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .trim();

export const hasViewValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean' || typeof value === 'number') return true;
  return getPlainViewText(value).length > 0;
};

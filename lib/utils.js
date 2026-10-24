/** Reads one cookie value from a raw Cookie header. */
export function getCookieFromHeader(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function shortenText(text, maxLength = 124) {
  if (text && text.length > maxLength) {
    return `${text.substring(0, maxLength)} ...`;
  }
  return text;
}

/** Formats a date (Date, ISO string or millisecond string) like "March 2021". */
export function formatMonthYear(value) {
  if (!value) return '';
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Formats a date like "March 5, 2021". */
export function formatLongDate(value) {
  if (!value) return '';
  const date = new Date(/^\d+$/.test(String(value)) ? Number(value) : value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

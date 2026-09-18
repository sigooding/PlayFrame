/**
 * Dates are formatted from the ISO string alone, with a fixed locale and time zone, so the server
 * and the browser always produce the same characters. Formatting in the viewer's own locale is the
 * classic cause of "server rendered HTML didn't match the client" warnings.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatShortDate(value?: string): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) return `${MONTHS[Number(match[2]) - 1]} ${Number(match[3])}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/** Thousands separators that do not depend on the runtime's locale or ICU build. */
export function formatCount(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

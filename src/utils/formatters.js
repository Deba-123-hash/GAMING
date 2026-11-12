export function formatRating(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '00';
  return String(Math.max(0, Math.min(99, Math.round(numeric)))).padStart(2, '0');
}

export function formatEventDate(isoDate) {
  if (!isoDate) return 'TBD';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

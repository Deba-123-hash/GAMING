export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export function parsePaginationParams(searchParams, { defaultLimit = DEFAULT_LIMIT } = {}) {
  const rawPage = Number(searchParams?.get?.('page') || DEFAULT_PAGE);
  const rawLimit = Number(
    searchParams?.get?.('limit') || searchParams?.get?.('pageSize') || defaultLimit
  );

  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : DEFAULT_PAGE;
  const limit =
    Number.isFinite(rawLimit) && rawLimit >= 1
      ? Math.min(MAX_LIMIT, Math.floor(rawLimit))
      : defaultLimit;

  const sortBy = String(searchParams?.get?.('sortBy') || searchParams?.get?.('sort') || '').trim();
  const order =
    String(searchParams?.get?.('order') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    offset: (page - 1) * limit,
    sortBy,
    order,
  };
}

export function buildPaginationMeta({ page, limit, total }) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const totalPages = Math.max(1, Math.ceil(safeTotal / limit));
  return {
    page,
    limit,
    total: safeTotal,
    totalPages,
  };
}

import crypto from 'node:crypto';
import { getDevStore } from '@/server/database/devMemoryStore';
import { computeEventStatus } from '@/data/events';
import { ApiError, ERROR_CODES } from '@/server/utils/apiError';
import { slugify } from '@/utils/formatters';
import { recordAuditEvent } from '@/server/services/auditService';

// --- Events ---
export function listCmsEvents({ category, status, search, includeDrafts = false } = {}) {
  const store = getDevStore();
  const q = search ? search.trim().toLowerCase() : '';

  const hydrated = store.events
    .filter((ev) => includeDrafts || ev.publicationStatus === 'published')
    .map((ev) => ({ ...ev, status: computeEventStatus(ev) }))
    .filter((ev) => {
      const matchCat = !category || category === 'ALL' || ev.category === category;
      const matchStatus = !status || status === 'ALL' || ev.status === status;
      const matchSearch =
        !q || ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q);
      return matchCat && matchStatus && matchSearch;
    });

  return hydrated;
}

export function findCmsEvent(slug, { includeDrafts = false } = {}) {
  const store = getDevStore();
  const ev = store.events.find((item) => item.slug === slug || item.id === slug);
  if (!ev || (!includeDrafts && ev.publicationStatus !== 'published')) return null;
  return { ...ev, status: computeEventStatus(ev) };
}

export function createCmsEvent(input, actorUser, requestId = null) {
  const store = getDevStore();
  const slug = input.slug || slugify(input.title);
  if (store.events.some((e) => e.slug === slug)) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Event slug already exists.',
    });
  }
  const ev = {
    id: slug,
    slug,
    ...input,
    isOnline: true,
    publicationStatus: input.publicationStatus || 'draft',
    isFeatured: Boolean(input.isFeatured),
  };
  store.events.unshift(ev);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'event.create',
    targetType: 'event',
    targetId: ev.id,
    requestId,
  });
  return { ...ev, status: computeEventStatus(ev) };
}

export function updateCmsEvent(idOrSlug, updates, actorUser, requestId = null) {
  const store = getDevStore();
  const ev = store.events.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
  if (!ev)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Event not found.',
    });
  Object.assign(ev, updates);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'event.update',
    targetType: 'event',
    targetId: ev.id,
    requestId,
  });
  return { ...ev, status: computeEventStatus(ev) };
}

export function deleteCmsEvent(idOrSlug, actorUser, requestId = null) {
  const store = getDevStore();
  const idx = store.events.findIndex((e) => e.id === idOrSlug || e.slug === idOrSlug);
  if (idx === -1)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Event not found.',
    });
  const [removed] = store.events.splice(idx, 1);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'event.delete',
    targetType: 'event',
    targetId: removed.id,
    requestId,
  });
  return { deletedId: removed.id };
}

export function registerForEvent(slug, userId) {
  const store = getDevStore();
  const ev = findCmsEvent(slug);
  if (!ev)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Event not found.',
    });
  if (ev.registrationDeadline && new Date() > new Date(ev.registrationDeadline)) {
    throw new ApiError({
      statusCode: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: 'Registration deadline has passed.',
    });
  }
  const exists = store.eventRegistrations.some((r) => r.eventId === ev.id && r.userId === userId);
  if (exists) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Already registered for this event.',
    });
  }
  const reg = {
    id: crypto.randomUUID(),
    eventId: ev.id,
    userId,
    status: 'registered',
    registeredAt: new Date().toISOString(),
  };
  store.eventRegistrations.push(reg);
  return reg;
}

// --- News ---
export function listCmsNews({ category, search, includeDrafts = false } = {}) {
  const store = getDevStore();
  const q = search ? search.trim().toLowerCase() : '';
  return store.news.filter((article) => {
    if (!includeDrafts && article.publicationStatus !== 'published') return false;
    const matchCat = !category || category === 'ALL' || article.category === category;
    const matchSearch =
      !q || article.title.toLowerCase().includes(q) || article.excerpt.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

export function findCmsNews(slug, { includeDrafts = false } = {}) {
  const store = getDevStore();
  const article = store.news.find((n) => n.slug === slug);
  if (!article || (!includeDrafts && article.publicationStatus !== 'published')) return null;
  return article;
}

export function createCmsNews(input, actorUser, requestId = null) {
  const store = getDevStore();
  const slug = input.slug || slugify(input.title);
  if (store.news.some((n) => n.slug === slug)) {
    throw new ApiError({
      statusCode: 409,
      code: ERROR_CODES.CONFLICT,
      message: 'Article slug already exists.',
    });
  }
  const status = input.publicationStatus || 'draft';
  const article = {
    slug,
    ...input,
    author: actorUser.fullName || actorUser.username,
    tags: input.tags || [],
    publicationStatus: status,
    publishedAt: status === 'published' ? new Date().toISOString().slice(0, 10) : null,
    isFeatured: Boolean(input.isFeatured),
  };
  store.news.unshift(article);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'news.create',
    targetType: 'news',
    targetId: article.slug,
    requestId,
  });
  return article;
}

export function updateCmsNews(slug, updates, actorUser, requestId = null) {
  const store = getDevStore();
  const article = store.news.find((n) => n.slug === slug);
  if (!article)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Article not found.',
    });
  Object.assign(article, updates);
  if (updates.publicationStatus === 'published' && !article.publishedAt) {
    article.publishedAt = new Date().toISOString().slice(0, 10);
  }
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'news.update',
    targetType: 'news',
    targetId: article.slug,
    requestId,
  });
  return article;
}

export function deleteCmsNews(slug, actorUser, requestId = null) {
  const store = getDevStore();
  const idx = store.news.findIndex((n) => n.slug === slug);
  if (idx === -1)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Article not found.',
    });
  const [removed] = store.news.splice(idx, 1);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'news.delete',
    targetType: 'news',
    targetId: removed.slug,
    requestId,
  });
  return { deletedSlug: removed.slug };
}

// --- Media ---
export function listCmsMedia({ category, mediaType, includeDrafts = false } = {}) {
  const store = getDevStore();
  return store.media.filter((item) => {
    if (!includeDrafts && item.publicationStatus !== 'published') return false;
    const matchCat = !category || category === 'ALL' || item.category === category;
    const matchType = !mediaType || mediaType === 'ALL' || item.mediaType === mediaType;
    return matchCat && matchType;
  });
}

export function createCmsMedia(input, actorUser, requestId = null) {
  const store = getDevStore();
  const item = {
    id: `media-${crypto.randomUUID().slice(0, 8)}`,
    ...input,
    accent: '#C6FF3D',
    publicationStatus: input.publicationStatus || 'draft',
    isFeatured: Boolean(input.isFeatured),
    note: 'Added via Content Management API',
  };
  store.media.unshift(item);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'media.create',
    targetType: 'media',
    targetId: item.id,
    requestId,
  });
  return item;
}

export function deleteCmsMedia(id, actorUser, requestId = null) {
  const store = getDevStore();
  const idx = store.media.findIndex((m) => m.id === id);
  if (idx === -1)
    throw new ApiError({
      statusCode: 404,
      code: ERROR_CODES.NOT_FOUND,
      message: 'Media item not found.',
    });
  const [removed] = store.media.splice(idx, 1);
  recordAuditEvent({
    actorUserId: actorUser.id,
    actorRole: actorUser.role,
    action: 'media.delete',
    targetType: 'media',
    targetId: removed.id,
    requestId,
  });
  return { deletedId: removed.id };
}

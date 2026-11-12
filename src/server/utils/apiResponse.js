import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export function createRequestId() {
  return crypto.randomUUID();
}

export function successResponse({
  data = {},
  message = 'Request completed successfully',
  meta = {},
  status = 200,
  headers = {},
} = {}) {
  const requestId = meta.requestId || createRequestId();
  return NextResponse.json(
    {
      success: true,
      ok: true,
      message,
      data,
      meta: { ...meta, requestId },
    },
    { status, headers }
  );
}

export function errorResponse({
  message = 'An error occurred',
  code = 'INTERNAL_SERVER_ERROR',
  status = 500,
  details = null,
  meta = {},
  headers = {},
} = {}) {
  const requestId = meta.requestId || createRequestId();
  const errorPayload = { code };
  if (details) {
    errorPayload.details = details;
  }

  return NextResponse.json(
    {
      success: false,
      ok: false,
      message,
      error: errorPayload,
      meta: { ...meta, requestId },
    },
    { status, headers }
  );
}

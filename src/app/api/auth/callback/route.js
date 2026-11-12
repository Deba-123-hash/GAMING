import { NextResponse } from 'next/server';
import { sanitizeRedirectPath } from '@/server/auth/authValidation';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const nextPath = sanitizeRedirectPath(url.searchParams.get('next'));
  return NextResponse.redirect(new URL(nextPath, url.origin));
}

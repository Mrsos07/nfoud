import { NextResponse } from 'next/server';
import { supabase } from './supabase';

export async function isValidAccessToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const { data, error } = await supabase.auth.getUser(token);
  return !error && !!data.user;
}

// Server-side guard for API routes. Returns a 401 response when the request
// lacks a valid Supabase access token, or null when the caller is authenticated.
export async function requireAuth(request: Request): Promise<NextResponse | null> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (await isValidAccessToken(token)) return null;
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Guard for server actions: forms must include <AuthTokenField />.
export async function isAuthorizedAction(formData: FormData): Promise<boolean> {
  return isValidAccessToken(String(formData.get('access_token') || ''));
}

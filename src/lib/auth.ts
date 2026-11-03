import { supabase } from './supabase';

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function isAuthenticated() {
  const user = await getUser();
  return !!user;
}

// Client-side fetch that attaches the current Supabase session token,
// required by protected API routes (/api/admin/*, /api/generate-keywords).
export async function authFetch(input: string, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(init.headers);
  if (session?.access_token) headers.set('Authorization', `Bearer ${session.access_token}`);
  return fetch(input, { ...init, headers });
}

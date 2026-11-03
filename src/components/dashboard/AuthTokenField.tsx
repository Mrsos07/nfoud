'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Hidden input carrying the current Supabase access token so server actions
// can verify the caller (see isAuthorizedAction).
export default function AuthTokenField() {
  const [token, setToken] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? ''));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setToken(session?.access_token ?? '');
    });
    return () => subscription.unsubscribe();
  }, []);

  return <input type="hidden" name="access_token" value={token} />;
}

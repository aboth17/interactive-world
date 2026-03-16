import { supabase } from './supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Get existing session or create an anonymous one.
 * Called once on app boot.
 */
export async function ensureSession(): Promise<User> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) return session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user!;
}

/**
 * Sign in with Google. If the current user is anonymous, link the identity
 * so that the UUID (and all visit rows) are preserved.
 */
export async function signInWithGoogle(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.is_anonymous) {
    const { error } = await supabase.auth.linkIdentity({ provider: 'google' });
    if (error) throw error;
  } else {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  }
}

/**
 * Sign out, then immediately create a new anonymous session
 * so the app always has a user context.
 */
export async function signOut(): Promise<User> {
  await supabase.auth.signOut();
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user!;
}

export function isAnonymous(user: User | null): boolean {
  return user?.is_anonymous === true;
}

export function onAuthChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}

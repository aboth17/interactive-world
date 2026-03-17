import { supabase } from './supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Get existing session or create an anonymous one.
 * Called once on app boot.
 */
export async function ensureSession(): Promise<User> {
  console.log('[auth] ensureSession called');

  const session = await new Promise<Session | null>((resolve) => {
    console.log('[auth] subscribing to onAuthStateChange...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[auth] onAuthStateChange event:', event, 'session:', session ? `user=${session.user?.id}, anon=${session.user?.is_anonymous}` : 'null');
        // INITIAL_SESSION is the normal path, but StrictMode's first mount
        // can consume it — the second mount then only sees SIGNED_IN.
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          subscription.unsubscribe();
          // Defer to next macrotask so we're outside Supabase's internal
          // auth lock. Resolving synchronously here causes downstream
          // queries (e.g. visitedStore.hydrate) to deadlock waiting for
          // the lock that's still held by the event emitter.
          setTimeout(() => resolve(session), 0);
        }
      }
    );
  });

  console.log('[auth] INITIAL_SESSION resolved. session:', session ? `user=${session.user?.id}, anon=${session.user?.is_anonymous}` : 'null');

  if (session?.user) {
    console.log('[auth] returning existing user:', session.user.id, 'anon:', session.user.is_anonymous);
    return session.user;
  }

  console.log('[auth] no session found, calling signInAnonymously...');
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('[auth] signInAnonymously error:', error);
    throw error;
  }
  console.log('[auth] anonymous user created:', data.user!.id);
  return data.user!;
}

/**
 * Sign in with Google via OAuth redirect.
 * Always uses signInWithOAuth (not linkIdentity) to avoid
 * redirect-based errors that can't be caught in JS.
 */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
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

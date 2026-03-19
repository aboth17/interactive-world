import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import Globe from './components/Globe';
import AudioToggle from './components/AudioToggle';
import SearchInput from './components/SearchInput';
import ExplorationStats from './components/ExplorationStats';
import PhotoImport from './components/PhotoImport';
import StreetView from './components/StreetView';
import AuthButton from './components/AuthButton';
import { ensureSession, onAuthChange } from './lib/auth';
import { visitedStore } from './stores/visitedStore';

interface StreetViewTarget {
  lat: number;
  lng: number;
  name: string;
}

export default function App() {
  const [streetView, setStreetView] = useState<StreetViewTarget | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    console.log('[App] useEffect fired, cancelled:', cancelled);

    ensureSession()
      .then(async (u) => {
        console.log('[App] ensureSession resolved, cancelled:', cancelled, 'user:', u.id, 'anon:', u.is_anonymous);
        if (cancelled) return;
        setUser(u);
        await visitedStore.init(u.id);
        setAuthReady(true);
        console.log('[App] authReady set to true');
      })
      .catch((err) => {
        console.error('[App] Auth init failed:', err);
        setAuthReady(true);
      });

    // Listen for auth changes after the initial load (e.g. cross-tab sign-in).
    // Sign-out is handled directly by AuthButton via onUserChange.
    // Do NOT call visitedStore.init() here — it makes Supabase queries that
    // deadlock if still inside the auth lock context. ensureSession handles init.
    const subscription = onAuthChange(async (event, session) => {
      console.log('[App] onAuthChange event:', event, 'cancelled:', cancelled);
      if (cancelled) return;
      if (event !== 'SIGNED_IN') return;
      const newUser = session?.user ?? null;
      if (!newUser) return;
      console.log('[App] SIGNED_IN: updating user to', newUser.id, 'anon:', newUser.is_anonymous);
      setUser(newUser);
    });

    return () => {
      console.log('[App] useEffect cleanup, setting cancelled = true');
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Globe onCityClick={(lat, lng, name) => setStreetView({ lat, lng, name })} />
      {!streetView && <ExplorationStats />}
      {!streetView && <SearchInput />}
      {!streetView && <AudioToggle />}
      {!streetView && <PhotoImport />}
      {!streetView && authReady && <AuthButton user={user} onUserChange={setUser} />}
      {streetView && (
        <StreetView
          lat={streetView.lat}
          lng={streetView.lng}
          cityName={streetView.name}
          onClose={() => setStreetView(null)}
        />
      )}
    </>
  );
}

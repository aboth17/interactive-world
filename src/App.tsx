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

    ensureSession()
      .then(async (u) => {
        if (cancelled) return;
        setUser(u);
        await visitedStore.init(u.id);
        setAuthReady(true);
      })
      .catch((err) => {
        console.error('Auth init failed:', err);
        // App still works with localStorage-cached data
        setAuthReady(true);
      });

    const subscription = onAuthChange(async (_event, session) => {
      if (cancelled) return;
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        visitedStore.reset();
        await visitedStore.init(newUser.id);
      }
    });

    return () => {
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
      {!streetView && authReady && <AuthButton user={user} />}
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

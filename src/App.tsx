import { useState } from 'react';
import Globe from './components/Globe';
import AudioToggle from './components/AudioToggle';
import SearchInput from './components/SearchInput';
import ExplorationStats from './components/ExplorationStats';
import StreetView from './components/StreetView';

interface StreetViewTarget {
  lat: number;
  lng: number;
  name: string;
}

export default function App() {
  const [streetView, setStreetView] = useState<StreetViewTarget | null>(null);

  return (
    <>
      <Globe onCityClick={(lat, lng, name) => setStreetView({ lat, lng, name })} />
      {!streetView && <ExplorationStats />}
      {!streetView && <SearchInput />}
      {!streetView && <AudioToggle />}
      {streetView && (
        <StreetView
          lat={streetView.lat}
          lng={streetView.lng}
          onClose={() => setStreetView(null)}
        />
      )}
    </>
  );
}

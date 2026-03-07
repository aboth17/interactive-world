import Globe from './components/Globe';
import AudioToggle from './components/AudioToggle';
import SearchInput from './components/SearchInput';
import ExplorationStats from './components/ExplorationStats';
import PhotoImport from './components/PhotoImport';

export default function App() {
  return (
    <>
      <Globe />
      <ExplorationStats />
      <SearchInput />
      <AudioToggle />
      <PhotoImport />
    </>
  );
}

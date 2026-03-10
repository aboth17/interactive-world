import { useCallback, useEffect, useRef, useState } from 'react';
import exifr from 'exifr';
import { getCountryAtPoint, getNearestCity } from '../utils/geoData';
import { visitedStore } from '../stores/visitedStore';

type Phase = 'idle' | 'scanning' | 'done';

interface ScanResult {
  total: number;
  withGps: number;
  countriesAdded: string[];
  citiesAdded: string[];
  skipped: number;
}

export default function PhotoImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    if (arr.length === 0) return;

    setDragging(false);
    setPhase('scanning');
    setProgress(0);
    setResult(null);

    const newCountries = new Map<string, string>(); // id → name
    const newCities = new Set<string>();
    let withGps = 0;
    let skipped = 0;

    for (let i = 0; i < arr.length; i++) {
      setProgress(Math.round(((i + 1) / arr.length) * 100));
      try {
        const gps = await exifr.gps(arr[i]);
        if (!gps?.latitude || !gps?.longitude) { skipped++; continue; }
        withGps++;

        const [country, city] = await Promise.all([
          getCountryAtPoint(gps.latitude, gps.longitude),
          Promise.resolve(getNearestCity(gps.latitude, gps.longitude)),
        ]);

        if (country) {
          const id = String(country.id);
          if (!visitedStore.getCountryCodes().has(id)) {
            newCountries.set(id, country.properties.name);
          }
          visitedStore.addCountry(id);
        }

        if (city) {
          const key = `${city.name}, ${city.country}`;
          if (!newCities.has(key)) {
            newCities.add(key);
            visitedStore.addCity({
              name: city.name,
              lat: city.lat,
              lng: city.lng,
              countryId: city.countryCode,
            });
          }
        }
      } catch {
        skipped++;
      }
    }

    setResult({
      total: arr.length,
      withGps,
      countriesAdded: Array.from(newCountries.values()),
      citiesAdded: Array.from(newCities),
      skipped,
    });
    setPhase('done');
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = '';
  }

  function reset() {
    setPhase('idle');
    setResult(null);
    setProgress(0);
  }

  // --- Global drag-and-drop listeners ---
  const onDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer?.types.includes('Files')) {
      setDragging(true);
    }
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  }, []);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    if (e.dataTransfer?.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [onDragEnter, onDragLeave, onDragOver, onDrop]);

  return (
    <>
      {/* Full-page drop overlay */}
      {dragging && (
        <div style={styles.dropOverlay}>
          <div style={styles.dropContent}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 190, 80, 0.8)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <div style={styles.dropText}>Drop photos to scan</div>
            <div style={styles.dropSubtext}>GPS data will be used to light up your globe</div>
          </div>
        </div>
      )}

      <div style={styles.wrapper}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        {phase === 'idle' && (
          <button style={styles.btn} onClick={() => inputRef.current?.click()} title="Import photos">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={styles.btnLabel}>Import Photos</span>
          </button>
        )}

        {phase === 'scanning' && (
          <div style={styles.panel}>
            <div style={styles.panelLabel}>Scanning photos... {progress}%</div>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: `${progress}%` }} />
            </div>
          </div>
        )}

        {phase === 'done' && result && (
          <div style={styles.panel}>
            <div style={styles.resultHeader}>
              {result.withGps > 0 ? '\u2726 Scan complete' : 'No GPS data found'}
            </div>
            <div style={styles.stats}>
              <span style={styles.stat}>{result.total} photos</span>
              <span style={styles.statSep}>\u00b7</span>
              <span style={styles.stat}>{result.withGps} with GPS</span>
              {result.skipped > 0 && (
                <>
                  <span style={styles.statSep}>\u00b7</span>
                  <span style={styles.statDim}>{result.skipped} skipped</span>
                </>
              )}
            </div>
            {result.countriesAdded.length > 0 && (
              <div style={styles.list}>
                <div style={styles.listLabel}>New countries</div>
                {result.countriesAdded.map(c => (
                  <div key={c} style={styles.listItem}>+ {c}</div>
                ))}
              </div>
            )}
            {result.citiesAdded.length > 0 && (
              <div style={styles.list}>
                <div style={styles.listLabel}>New cities</div>
                {result.citiesAdded.map(c => (
                  <div key={c} style={styles.listItem}>+ {c}</div>
                ))}
              </div>
            )}
            {result.countriesAdded.length === 0 && result.citiesAdded.length === 0 && result.withGps > 0 && (
              <div style={styles.statDim}>All places already marked.</div>
            )}
            <button style={styles.doneBtn} onClick={reset}>Done</button>
          </div>
        )}
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  dropOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  dropContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '48px 64px',
    border: '1px solid rgba(255, 190, 80, 0.25)',
    borderRadius: 24,
    background: 'rgba(8, 8, 18, 0.6)',
  },
  dropText: {
    color: 'rgba(255, 190, 80, 0.9)',
    fontSize: 18,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
    letterSpacing: '0.02em',
  },
  dropSubtext: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  wrapper: {
    position: 'fixed',
    bottom: 36,
    right: 28,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: 'rgba(8, 8, 18, 0.75)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
    cursor: 'pointer',
    letterSpacing: '0.01em',
  },
  btnLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  panel: {
    width: 280,
    padding: '16px 18px',
    background: 'rgba(8, 8, 18, 0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  panelLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  barTrack: {
    height: 2,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: 'rgba(255, 190, 80, 0.7)',
    borderRadius: 2,
    transition: 'width 0.1s ease',
  },
  resultHeader: {
    color: 'rgba(255, 190, 80, 0.9)',
    fontSize: 13,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  stats: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  stat: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  statSep: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
  },
  statDim: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  listLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 2,
  },
  listItem: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  doneBtn: {
    marginTop: 4,
    padding: '7px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
};

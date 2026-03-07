import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader';
import { canUseApi, recordApiCalls } from '../utils/streetViewUsage';
import { findLandmark } from '../utils/landmarkLookup';

interface StreetViewProps {
  lat: number;
  lng: number;
  cityName: string;
  onClose: () => void;
}

type Phase = 'fade-to-black' | 'loading' | 'revealing' | 'active' | 'no-coverage' | 'fade-out' | 'over-limit';

export default function StreetView({ lat, lng, cityName, onClose }: StreetViewProps) {
  const panoRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [phase, setPhase] = useState<Phase>('fade-to-black');

  // Phase 1: Slow fade to black, then start loading
  useEffect(() => {
    // Small delay so the opacity transition actually plays (mounted at opacity 0)
    const kickoff = requestAnimationFrame(() => {
      // Triggers the CSS transition to opacity 1 (black screen)
    });

    const loadTimer = setTimeout(() => {
      if (!canUseApi(2)) {
        setPhase('over-limit');
        return;
      }
      setPhase('loading');
    }, 900); // Wait for fade-to-black to complete before loading

    return () => {
      cancelAnimationFrame(kickoff);
      clearTimeout(loadTimer);
    };
  }, []);

  // Phase 2: Load landmark + panorama behind the black screen
  useEffect(() => {
    if (phase !== 'loading') return;

    let cancelled = false;

    async function init() {
      try {
        await loadGoogleMapsApi();
      } catch {
        if (!cancelled) setPhase('no-coverage');
        return;
      }
      if (cancelled) return;

      let targetLat = lat;
      let targetLng = lng;
      const landmark = await findLandmark(cityName, lat, lng);
      if (cancelled) return;
      if (landmark) {
        targetLat = landmark.lat;
        targetLng = landmark.lng;
        console.log(`[StreetView] Using landmark: ${landmark.name} at ${targetLat}, ${targetLng}`);
      } else {
        console.log(`[StreetView] No landmark found, using city center: ${lat}, ${lng}`);
      }

      const sv = new google.maps.StreetViewService();

      try {
        // Use tight radius when we have a landmark, wider when falling back to city center
        const result = await sv.getPanorama({
          location: { lat: targetLat, lng: targetLng },
          radius: landmark ? 100 : 1000,
          preference: google.maps.StreetViewPreference.NEAREST,
          source: google.maps.StreetViewSource.OUTDOOR,
        });

        if (cancelled || !panoRef.current) return;

        const panoLocation = result.data.location;
        if (!panoLocation?.latLng) {
          setPhase('no-coverage');
          return;
        }

        console.log(`[StreetView] Panorama found: "${panoLocation.description}" at ${panoLocation.latLng.lat()}, ${panoLocation.latLng.lng()} (pano: ${panoLocation.pano})`);

        recordApiCalls(1);

        let heading = 0;
        if (landmark) {
          heading = google.maps.geometry?.spherical?.computeHeading(
            panoLocation.latLng!,
            new google.maps.LatLng(targetLat, targetLng),
          ) ?? 0;
        }

        const panorama = new google.maps.StreetViewPanorama(panoRef.current, {
          pano: panoLocation.pano!,
          pov: { heading, pitch: 10 },
          zoom: 1,
          disableDefaultUI: true,
          showRoadLabels: false,
          motionTracking: false,
        });

        panoramaRef.current = panorama;

        // Wait for panorama tiles to actually render before revealing
        google.maps.event.addListenerOnce(panorama, 'pano_changed', () => {
          if (!cancelled) {
            // Give tiles a moment to paint
            setTimeout(() => {
              if (!cancelled) setPhase('revealing');
            }, 300);
          }
        });

        // Fallback: if pano_changed doesn't fire within 3s, reveal anyway
        setTimeout(() => {
          if (!cancelled && phase === 'loading') {
            setPhase('revealing');
          }
        }, 3000);
      } catch {
        if (!cancelled) setPhase('no-coverage');
      }
    }

    init();
    return () => { cancelled = true; };
  }, [phase, lat, lng, cityName]);

  // Phase 3: Fade the black screen away, then go active
  useEffect(() => {
    if (phase !== 'revealing') return;
    const timer = setTimeout(() => setPhase('active'), 800);
    return () => clearTimeout(timer);
  }, [phase]);

  function handleClose() {
    setPhase('fade-out');
    setTimeout(onClose, 800);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Black screen is opaque during fade-to-black, loading, and fade-out
  const blackOpaque = phase === 'loading' || phase === 'fade-out';
  const blackVisible = phase === 'fade-to-black' || blackOpaque;
  // Panorama mounts during loading (hidden behind black) and stays for active
  const panoMounted = phase === 'loading' || phase === 'revealing' || phase === 'active';
  const showMessage = phase === 'no-coverage' || phase === 'over-limit';

  return (
    <div style={{
      ...styles.overlay,
      opacity: phase === 'fade-to-black' ? 0 : 1,
    }}>
      {/* Vignette — always on top, pointer-transparent */}
      <div style={styles.vignette} />

      {/* Black screen — fades in, stays during load, fades out to reveal pano */}
      <div style={{
        ...styles.blackScreen,
        opacity: blackVisible ? 1 : 0,
        pointerEvents: blackOpaque ? 'auto' : 'none',
      }} />

      {/* Panorama — mounted behind black screen during loading */}
      {panoMounted && (
        <div ref={panoRef} style={styles.panoContainer} />
      )}

      {/* Loading dot — shows on black during API work */}
      {(phase === 'loading' || phase === 'fade-to-black') && (
        <div style={styles.centerMessage}>
          <div style={styles.loadingDot} />
        </div>
      )}

      {/* Error messages */}
      {showMessage && (
        <div style={styles.centerMessage}>
          <p style={styles.messageText}>
            {phase === 'no-coverage'
              ? 'No street-level imagery available here'
              : 'Monthly Street View limit reached'}
          </p>
          <button onClick={handleClose} style={styles.backButton}>
            Return to globe
          </button>
        </div>
      )}

      {/* Close button — only when panorama is visible */}
      {(phase === 'revealing' || phase === 'active') && (
        <button onClick={handleClose} style={styles.closeButton} title="Return to globe (Esc)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: '#000',
    transition: 'opacity 0.8s ease',
  },
  blackScreen: {
    position: 'absolute',
    inset: 0,
    background: '#000',
    transition: 'opacity 0.8s ease',
    zIndex: 101,
  },
  panoContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    zIndex: 103,
    pointerEvents: 'none',
    boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.5)',
  },
  centerMessage: {
    position: 'absolute',
    inset: 0,
    zIndex: 104,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  messageText: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: 300,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
  },
  backButton: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: 400,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: '8px 20px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 105,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.4)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

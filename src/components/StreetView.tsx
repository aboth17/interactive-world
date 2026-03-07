import { useEffect, useRef, useState } from 'react';
import { loadGoogleMapsApi } from '../utils/googleMapsLoader';
import { canLoadPanorama, recordPanoramaLoad } from '../utils/streetViewUsage';

interface StreetViewProps {
  lat: number;
  lng: number;
  onClose: () => void;
}

type Phase = 'fade-in' | 'loading' | 'active' | 'no-coverage' | 'fade-out' | 'over-limit';

export default function StreetView({ lat, lng, onClose }: StreetViewProps) {
  const panoRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [phase, setPhase] = useState<Phase>('fade-in');

  useEffect(() => {
    // Fade in from black
    const fadeTimer = setTimeout(() => {
      if (!canLoadPanorama()) {
        setPhase('over-limit');
        return;
      }
      setPhase('loading');
    }, 350);
    return () => clearTimeout(fadeTimer);
  }, []);

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

      const sv = new google.maps.StreetViewService();

      try {
        const result = await sv.getPanorama({
          location: { lat, lng },
          radius: 1000,
          preference: google.maps.StreetViewPreference.NEAREST,
          source: google.maps.StreetViewSource.OUTDOOR,
        });

        if (cancelled || !panoRef.current) return;

        const panoLocation = result.data.location;
        if (!panoLocation?.latLng) {
          setPhase('no-coverage');
          return;
        }

        recordPanoramaLoad();

        const panorama = new google.maps.StreetViewPanorama(panoRef.current, {
          pano: panoLocation.pano!,
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          // Hide all Google chrome
          disableDefaultUI: true,
          showRoadLabels: false,
          motionTracking: false,
        });

        panoramaRef.current = panorama;
        setPhase('active');
      } catch {
        if (!cancelled) setPhase('no-coverage');
      }
    }

    init();
    return () => { cancelled = true; };
  }, [phase, lat, lng]);

  function handleClose() {
    setPhase('fade-out');
    setTimeout(onClose, 350);
  }

  // Escape key to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const showBlack = phase === 'fade-in' || phase === 'fade-out';
  const showPano = phase === 'loading' || phase === 'active';
  const showMessage = phase === 'no-coverage' || phase === 'over-limit';

  return (
    <div style={{
      ...styles.overlay,
      opacity: phase === 'fade-in' ? 0 : 1,
    }}>
      {/* Vignette */}
      <div style={styles.vignette} />

      {/* Black fade layer */}
      <div style={{
        ...styles.blackScreen,
        opacity: showBlack ? 1 : 0,
        pointerEvents: showBlack ? 'auto' : 'none',
      }} />

      {/* Panorama container */}
      {showPano && (
        <div ref={panoRef} style={styles.panoContainer} />
      )}

      {/* Loading indicator */}
      {phase === 'loading' && (
        <div style={styles.centerMessage}>
          <div style={styles.loadingDot} />
        </div>
      )}

      {/* No coverage / over limit message */}
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

      {/* Close button */}
      {phase === 'active' && (
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
    transition: 'opacity 0.35s ease',
  },
  blackScreen: {
    position: 'absolute',
    inset: 0,
    background: '#000',
    transition: 'opacity 0.35s ease',
    zIndex: 101,
  },
  panoContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 102,
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

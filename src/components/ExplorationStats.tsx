import { useState, useEffect, useRef } from 'react';
import { visitedStore } from '../stores/visitedStore';
import PlacesPanel from './PlacesPanel';

function useAnimatedValue(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef({ value: target, time: 0 });

  useEffect(() => {
    const start = display;
    if (start === target) return;
    startRef.current = { value: start, time: performance.now() };

    const animate = (now: number) => {
      const elapsed = now - startRef.current.time;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRef.current.value + (target - startRef.current.value) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export default function ExplorationStats() {
  const [countryCount, setCountryCount] = useState(() => visitedStore.getCountryCodes().size);
  const [cityCount, setCityCount] = useState(() => visitedStore.getCities().length);
  const [searchFocused, setSearchFocused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    return visitedStore.subscribe(() => {
      setCountryCount(visitedStore.getCountryCodes().size);
      setCityCount(visitedStore.getCities().length);
    });
  }, []);

  // Fade when search input is focused
  useEffect(() => {
    const onFocus = () => setSearchFocused(true);
    const onBlur = () => setSearchFocused(false);
    const input = document.querySelector('input[placeholder*="Search"]');
    if (input) {
      input.addEventListener('focus', onFocus);
      input.addEventListener('blur', onBlur);
      return () => {
        input.removeEventListener('focus', onFocus);
        input.removeEventListener('blur', onBlur);
      };
    }
  }, []);

  const animatedCountries = useAnimatedValue(countryCount);
  const animatedCities = useAnimatedValue(cityCount);
  const percentage = countryCount / 195 * 100;
  const animatedPct = useAnimatedValue(percentage);

  if (countryCount === 0 && cityCount === 0) return null;

  return (
    <>
      {panelOpen && <PlacesPanel onClose={() => setPanelOpen(false)} />}

      {!panelOpen && (
        <div
          style={{
            ...styles.container,
            opacity: searchFocused ? 0.35 : 0.85,
          }}
          onClick={() => setPanelOpen(true)}
          title="View & edit my places"
        >
          <div style={styles.stat}>
            <span style={styles.number}>{Math.round(animatedCountries)}</span>
            <span style={styles.label}>countries</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.stat}>
            <span style={styles.number}>{Math.round(animatedCities)}</span>
            <span style={styles.label}>cities</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.stat}>
            <span style={styles.number}>{animatedPct.toFixed(1)}%</span>
            <span style={styles.label}>of world visited</span>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 28,
    left: 28,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '10px 18px',
    background: 'rgba(4, 4, 12, 0.55)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    transition: 'opacity 0.4s ease',
    userSelect: 'none',
    cursor: 'pointer',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  number: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: 200,
    fontSize: 22,
    lineHeight: 1,
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: '-0.02em',
  },
  label: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontWeight: 300,
    fontSize: 10,
    lineHeight: 1,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 24,
    background: 'rgba(255, 255, 255, 0.08)',
  },
};

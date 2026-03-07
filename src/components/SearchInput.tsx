import { useState, useEffect, useRef, useCallback } from 'react';
import { visitedStore } from '../stores/visitedStore';
import { loadCountryInfo, type CountryInfo } from '../utils/geoData';
import { WORLD_CITIES, type WorldCity } from '../data/worldCities';

interface SearchResult {
  type: 'city' | 'country';
  label: string;
  sublabel: string;
  city?: WorldCity;
  country?: CountryInfo;
}

function searchPlaces(query: string, countries: CountryInfo[]): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  // Search cities
  for (const city of WORLD_CITIES) {
    const nameMatch = city.name.toLowerCase().startsWith(q);
    const fullMatch = `${city.name}, ${city.country}`.toLowerCase().includes(q);
    if (nameMatch || fullMatch) {
      results.push({
        type: 'city',
        label: city.name,
        sublabel: city.country,
        city,
      });
    }
    if (results.length >= 8) break;
  }

  // Search countries
  for (const country of countries) {
    if (country.name.toLowerCase().startsWith(q)) {
      // Don't duplicate if already shown via city
      results.push({
        type: 'country',
        label: country.name,
        sublabel: 'Country',
        country,
      });
    }
    if (results.length >= 12) break;
  }

  // Sort: exact prefix matches first, cities before countries
  results.sort((a, b) => {
    const aExact = a.label.toLowerCase().startsWith(q) ? 0 : 1;
    const bExact = b.label.toLowerCase().startsWith(q) ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    if (a.type !== b.type) return a.type === 'city' ? -1 : 1;
    return a.label.localeCompare(b.label);
  });

  return results.slice(0, 8);
}

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCountryInfo().then(setCountries);
  }, []);

  useEffect(() => {
    if (query.length > 0 && countries.length > 0) {
      setResults(searchPlaces(query, countries));
      setSelectedIndex(-1);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, countries]);

  // Cmd+K to focus
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selectResult = useCallback((result: SearchResult) => {
    if (result.type === 'city' && result.city) {
      visitedStore.addCity({
        name: result.city.name,
        lat: result.city.lat,
        lng: result.city.lng,
        countryId: result.city.countryCode,
      });
      window.dispatchEvent(new CustomEvent('globe:flyto', {
        detail: { lat: result.city.lat, lng: result.city.lng },
      }));
    } else if (result.type === 'country' && result.country) {
      visitedStore.addCountry(result.country.id);
      window.dispatchEvent(new CustomEvent('globe:flyto', {
        detail: { lat: result.country.lat, lng: result.country.lng },
      }));
    }

    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      selectResult(results[selectedIndex]);
    }
  }

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.inputWrapper}>
        <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => { if (query) setIsOpen(true); }}
          placeholder="Search cities or countries..."
          style={styles.input}
          spellCheck={false}
          autoComplete="off"
        />
        <span style={styles.shortcut}>
          {navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl+'}K
        </span>
      </div>

      {isOpen && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((result, i) => (
            <div
              key={`${result.type}-${result.label}-${result.sublabel}`}
              style={{
                ...styles.item,
                ...(i === selectedIndex ? styles.itemSelected : {}),
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                selectResult(result);
              }}
            >
              <div style={styles.itemLeft}>
                <span style={styles.itemLabel}>{result.label}</span>
                <span style={styles.itemSublabel}>{result.sublabel}</span>
              </div>
              <span style={styles.itemType}>
                {result.type === 'city' ? 'City' : 'Country'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 36,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    width: 360,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    width: 16,
    height: 16,
    color: 'rgba(255, 255, 255, 0.35)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '13px 60px 13px 44px',
    background: 'rgba(8, 8, 18, 0.75)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 14,
    fontWeight: 300,
    letterSpacing: '0.01em',
    outline: 'none',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  },
  shortcut: {
    position: 'absolute',
    right: 14,
    fontSize: 11,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '3px 7px',
    borderRadius: 5,
    pointerEvents: 'none',
  },
  dropdown: {
    marginTop: 6,
    background: 'rgba(8, 8, 18, 0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    cursor: 'pointer',
    transition: 'background 0.12s ease',
  },
  itemSelected: {
    background: 'rgba(255, 255, 255, 0.06)',
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  itemLabel: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 14,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
  },
  itemSublabel: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 12,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
  },
  itemType: {
    color: 'rgba(255, 200, 100, 0.4)',
    fontSize: 11,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 400,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
};

import { useState, useEffect, useRef } from 'react';
import { visitedStore } from '../stores/visitedStore';
import { loadCountryInfo, type CountryInfo } from '../utils/geoData';
import type { City } from '../data/visitedCities';

type Tab = 'countries' | 'cities';

interface PlacesPanelProps {
  onClose: () => void;
}

export default function PlacesPanel({ onClose }: PlacesPanelProps) {
  const [tab, setTab] = useState<Tab>('countries');
  const [countryCodes, setCountryCodes] = useState<Set<string>>(() => visitedStore.getCountryCodes());
  const [cities, setCities] = useState<City[]>(() => visitedStore.getCities());
  const [countryInfo, setCountryInfo] = useState<Map<string, CountryInfo>>(new Map());
  const [filter, setFilter] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCountryInfo().then(info => {
      setCountryInfo(new Map(info.map(c => [c.id, c])));
    });
  }, []);

  useEffect(() => {
    return visitedStore.subscribe(() => {
      setCountryCodes(visitedStore.getCountryCodes());
      setCities(visitedStore.getCities());
    });
  }, []);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = filter.toLowerCase().trim();

  const sortedCountries = Array.from(countryCodes)
    .map(id => countryInfo.get(id))
    .filter((c): c is CountryInfo => !!c)
    .filter(c => !q || c.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedCities = [...cities]
    .filter(c => !q || c.name.toLowerCase().includes(q) || (countryInfo.get(c.countryId)?.name ?? '').toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div ref={panelRef} style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>My Places</span>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === 'countries' ? styles.tabActive : {}) }}
          onClick={() => setTab('countries')}
        >
          Countries <span style={styles.tabCount}>{countryCodes.size}</span>
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'cities' ? styles.tabActive : {}) }}
          onClick={() => setTab('cities')}
        >
          Cities <span style={styles.tabCount}>{cities.length}</span>
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter…"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={styles.filterInput}
        spellCheck={false}
      />

      {/* List */}
      <div style={styles.list}>
        {tab === 'countries' && (
          sortedCountries.length === 0
            ? <div style={styles.empty}>{q ? 'No matches' : 'No countries yet'}</div>
            : sortedCountries.map(c => (
              <div key={c.id} style={styles.item}>
                <span style={styles.itemName}>{c.name}</span>
                <button
                  style={styles.removeBtn}
                  onClick={() => visitedStore.removeCountry(c.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
        )}
        {tab === 'cities' && (
          sortedCities.length === 0
            ? <div style={styles.empty}>{q ? 'No matches' : 'No cities yet'}</div>
            : sortedCities.map(c => (
              <div key={`${c.name}-${c.countryId}`} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={styles.itemName}>{c.name}</span>
                  <span style={styles.itemSub}>{countryInfo.get(c.countryId)?.name ?? c.countryId}</span>
                </div>
                <button
                  style={styles.removeBtn}
                  onClick={() => visitedStore.removeCity(c.name, c.countryId)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'fixed',
    top: 28,
    left: 28,
    zIndex: 20,
    width: 300,
    maxHeight: 'calc(100vh - 80px)',
    background: 'rgba(6, 6, 16, 0.92)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px 10px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  title: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 300,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: '0.01em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    cursor: 'pointer',
    padding: '2px 4px',
    lineHeight: 1,
  },
  tabs: {
    display: 'flex',
    padding: '8px 12px 0',
    gap: 4,
  },
  tab: {
    flex: 1,
    padding: '7px 10px',
    background: 'none',
    border: '1px solid transparent',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 12,
    fontWeight: 300,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.8)',
  },
  tabCount: {
    fontSize: 10,
    color: 'rgba(255,190,80,0.6)',
    fontWeight: 400,
  },
  filterInput: {
    margin: '10px 12px 6px',
    padding: '7px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 12,
    fontWeight: 300,
    outline: 'none',
  },
  list: {
    overflowY: 'auto',
    flex: 1,
    padding: '4px 8px 12px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '7px 8px',
    borderRadius: 8,
    gap: 8,
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    minWidth: 0,
  },
  itemName: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 13,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.8)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemSub: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 11,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.3)',
  },
  removeBtn: {
    flexShrink: 0,
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    cursor: 'pointer',
    padding: '3px 6px',
    borderRadius: 5,
    lineHeight: 1,
    transition: 'color 0.15s',
  },
  empty: {
    padding: '24px 8px',
    textAlign: 'center',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 12,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.2)',
  },
};

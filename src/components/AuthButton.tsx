import { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { signInWithGoogle, signOut, deleteAccount, isAnonymous } from '../lib/auth';
import { visitedStore } from '../stores/visitedStore';

const NUDGE_DISMISSED_KEY = 'world-explorer-nudge-dismissed';
const NUDGE_DISMISS_DAYS = 7;
const SETTINGS_KEY = 'world-explorer-settings';

interface Settings {
  showLabels: boolean;
  globeAutoRotate: boolean;
}

const defaultSettings: Settings = {
  showLabels: true,
  globeAutoRotate: true,
};

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultSettings;
}

function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent('world-explorer-settings', { detail: s }));
}

function isNudgeDismissed(): boolean {
  const dismissed = localStorage.getItem(NUDGE_DISMISSED_KEY);
  if (!dismissed) return false;
  return Date.now() - new Date(dismissed).getTime() < NUDGE_DISMISS_DAYS * 86400000;
}

function dismissNudge() {
  localStorage.setItem(NUDGE_DISMISSED_KEY, new Date().toISOString());
}

const glass = {
  background: 'rgba(4, 4, 12, 0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
} as const;

export default function AuthButton({ user, onUserChange }: { user: User | null; onUserChange?: (user: User) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const anon = isAnonymous(user);
  const showSignIn = !user || anon;

  useEffect(() => {
    if (showSignIn && !isNudgeDismissed()) {
      const timer = setTimeout(() => setShowNudge(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowNudge(false);
  }, [showSignIn]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function updateSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  }

  async function handleSignIn() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setDropdownOpen(false);
    setLoading(true);
    try {
      const anonUser = await signOut();
      onUserChange?.(anonUser);
      visitedStore.reset();
      await visitedStore.init(anonUser.id);
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setLoading(false);
    }
  }

  const [confirmDelete, setConfirmDelete] = useState(false);

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDropdownOpen(false);
    setConfirmDelete(false);
    setLoading(true);
    try {
      const anonUser = await deleteAccount();
      onUserChange?.(anonUser);
      visitedStore.reset();
      await visitedStore.init(anonUser.id);
    } catch (err) {
      console.error('Delete account failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={dropdownRef} style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
      {showSignIn ? (
        <>
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              ...glass,
              borderRadius: 10,
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '8px 16px',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 13,
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign in
          </button>
          {showNudge && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              ...glass,
              borderColor: 'rgba(245, 158, 11, 0.2)',
              borderRadius: 8,
              padding: '8px 12px',
              color: 'rgba(245, 158, 11, 0.85)',
              fontSize: 11,
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Sign in to sync across devices
              <button
                onClick={() => { dismissNudge(); setShowNudge(false); }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer',
                  padding: '0 2px', fontSize: 12, lineHeight: 1,
                }}
              >
                x
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              ...glass,
              borderRadius: '50%',
              width: 40,
              height: 40,
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              borderColor: dropdownOpen ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              ...glass,
              background: 'rgba(4, 4, 12, 0.85)',
              borderRadius: 12,
              minWidth: 220,
              overflow: 'hidden',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}>
              {/* User info */}
              <div style={{
                padding: '14px 16px 12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(245, 158, 11, 0.9)', fontSize: 14, fontWeight: 500,
                }}>
                  {displayName?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {displayName || 'User'}
                  </div>
                  {user?.email && (
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.4)', fontSize: 11,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {user.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Settings */}
              <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{
                  padding: '4px 16px 6px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  Settings
                </div>
                <ToggleRow
                  label="City labels"
                  checked={settings.showLabels}
                  onChange={(v) => updateSetting('showLabels', v)}
                />
                <ToggleRow
                  label="Auto-rotate globe"
                  checked={settings.globeAutoRotate}
                  onChange={(v) => updateSetting('globeAutoRotate', v)}
                />
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '10px 16px',
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: 13,
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                Sign out
              </button>

              {/* Delete account */}
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  width: '100%',
                  background: confirmDelete ? 'rgba(255, 60, 60, 0.12)' : 'none',
                  border: 'none',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'rgba(255, 80, 80, 0.85)',
                  padding: '10px 16px',
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: 12,
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!confirmDelete) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                onMouseLeave={(e) => { if (!confirmDelete) e.currentTarget.style.background = 'none'; }}
              >
                {confirmDelete ? 'Tap again to confirm deletion' : 'Delete account'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '100%',
        background: 'none',
        border: 'none',
        padding: '7px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
    >
      <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 13 }}>{label}</span>
      <div style={{
        width: 32,
        height: 18,
        borderRadius: 9,
        background: checked ? 'rgba(245, 158, 11, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        position: 'relative',
        transition: 'background 0.2s',
      }}>
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: checked ? 'rgba(245, 158, 11, 0.95)' : 'rgba(255, 255, 255, 0.4)',
          position: 'absolute',
          top: 2,
          left: checked ? 16 : 2,
          transition: 'left 0.2s, background 0.2s',
        }} />
      </div>
    </button>
  );
}

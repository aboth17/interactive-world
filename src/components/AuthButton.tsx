import { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { signInWithGoogle, signOut, isAnonymous } from '../lib/auth';

const NUDGE_DISMISSED_KEY = 'world-explorer-nudge-dismissed';
const NUDGE_DISMISS_DAYS = 7;

function isNudgeDismissed(): boolean {
  const dismissed = localStorage.getItem(NUDGE_DISMISSED_KEY);
  if (!dismissed) return false;
  const dismissedAt = new Date(dismissed).getTime();
  return Date.now() - dismissedAt < NUDGE_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

function dismissNudge() {
  localStorage.setItem(NUDGE_DISMISSED_KEY, new Date().toISOString());
}

export default function AuthButton({ user }: { user: User | null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const anon = isAnonymous(user);

  useEffect(() => {
    if (anon && !isNudgeDismissed()) {
      const timer = setTimeout(() => setShowNudge(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowNudge(false);
  }, [anon]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignIn() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setDropdownOpen(false);
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;
  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
    >
      {anon ? (
        <>
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              color: '#f5f5f5',
              padding: '8px 16px',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign in
          </button>
          {showNudge && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'rgba(245, 158, 11, 0.9)',
                fontSize: 12,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Sign in to sync across devices
              <button
                onClick={() => {
                  dismissNudge();
                  setShowNudge(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: 14,
                  lineHeight: 1,
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
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              color: '#f5f5f5',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                {displayName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            {displayName}
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                overflow: 'hidden',
                minWidth: 140,
              }}
            >
              <button
                onClick={handleSignOut}
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#f5f5f5',
                  padding: '10px 16px',
                  cursor: loading ? 'wait' : 'pointer',
                  fontSize: 13,
                  textAlign: 'left',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

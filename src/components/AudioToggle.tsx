import { useState, useCallback } from 'react';
import { AudioManager } from '../audio/AudioManager';

export default function AudioToggle() {
  const [muted, setMuted] = useState(true);

  const handleClick = useCallback(async () => {
    const audio = AudioManager.getInstance();
    await audio.init();
    const nowMuted = audio.toggleMute();
    setMuted(nowMuted);
  }, []);

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 20,
        width: 44,
        height: 44,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        transition: 'background 0.2s',
        zIndex: 100,
      }}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '\u{1F507}' : '\u{1F50A}'}
    </button>
  );
}

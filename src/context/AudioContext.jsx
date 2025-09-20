import { createContext, useContext, useRef, useState, useCallback } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const currentRef = useRef(null);
  const [isPlayingGlobal, setIsPlayingGlobal] = useState(false);

  const requestPlay = useCallback((ref) => {
    if (!ref?.current) return;
    // Pause previous
    if (currentRef.current && currentRef.current !== ref.current) {
      try { currentRef.current.pause(); } catch (err) { console.warn('Audio pause prev failed', err); }
    }
    currentRef.current = ref.current;
    const a = currentRef.current;
    a.currentTime = 0;
    a.play().then(() => setIsPlayingGlobal(true)).catch((err) => { console.warn('Audio play failed', err); });
  }, []);

  const pauseIfCurrent = useCallback((ref) => {
    const a = ref?.current;
    if (a && currentRef.current === a) {
      try { a.pause(); setIsPlayingGlobal(false); } catch (err) { console.warn('Audio pause failed', err); }
    } else if (a) {
      try { a.pause(); } catch (err) { console.warn('Audio pause (non-current) failed', err); }
    }
  }, []);

  const stopAll = useCallback(() => {
    if (currentRef.current) {
      try { currentRef.current.pause(); } catch (err) { console.warn('Audio stop failed', err); }
      currentRef.current = null;
      setIsPlayingGlobal(false);
    }
  }, []);

  const value = { requestPlay, pauseIfCurrent, stopAll, isPlayingGlobal };
  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudioContext() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider');
  return ctx;
}

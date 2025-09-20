import { useEffect, useRef, useState } from 'react';
import { useAudioContext } from '../context/AudioContext.jsx';

const BOOKMARK_KEY = 'alquran.bookmarks';
const LAST_READ_KEY = 'alquran.lastRead';

function getBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}
function setBookmarks(arr) { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr)); }

export default function AyahItem({ surahNumber, ayah, isPlaying, onPlay, onPause, onEnded }) {
  const audioRef = useRef(null);
  const audio = useAudioContext();

  // Track bookmark state so the button updates immediately after click
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumberInSurah === ayah.n);
  });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying && ayah.audioUrl) {
      audio.requestPlay(audioRef);
    } else {
      audio.pauseIfCurrent(audioRef);
      if (a) a.currentTime = 0;
    }
  }, [isPlaying, ayah.audioUrl, audio]);

  const toggleBookmark = () => {
    const list = getBookmarks();
    const idx = list.findIndex(b => b.surahNumber === surahNumber && b.ayahNumberInSurah === ayah.n);
    if (idx >= 0) {
      list.splice(idx, 1);
      setIsBookmarked(false);
    } else {
      list.push({
        surahNumber,
        ayahNumberInSurah: ayah.n,
        arabText: ayah.arabText,
        idText: ayah.idText,
        audioUrl: ayah.audioUrl || null,
        timestamp: Date.now(),
      });
      setIsBookmarked(true);
    }
    setBookmarks(list);
  };

  const handlePlay = () => {
    if (!ayah.audioUrl) return;
    onPlay(ayah.n);
    // persist last read
    localStorage.setItem(LAST_READ_KEY, JSON.stringify({
      surahNumber,
      ayahNumberInSurah: ayah.n,
      updatedAt: Date.now(),
    }));
  };

  return (
    <div id={`ayah-${ayah.n}`} className={`ayah-item ${isPlaying ? 'playing' : ''}`}>
      <div className="ayah-meta">
        <span className="ayah-num">{ayah.n}</span>
        <button
          className={`bookmark-btn ${isBookmarked ? 'is-bookmarked' : ''}`}
          onClick={toggleBookmark}
          aria-label={isBookmarked ? 'Hapus simpanan ayat' : 'Simpan ayat'}
          aria-pressed={isBookmarked}
          title={isBookmarked ? 'Hapus simpanan' : 'Simpan ayat ini'}
        >
          {isBookmarked ? 'Tersimpan' : 'Simpan'}
        </button>
      </div>
      <div className="ayah-text arab" dir="rtl">{ayah.arabText}</div>
      <div className="ayah-text id">{ayah.idText}</div>
      <div className="ayah-audio">
        {ayah.audioUrl ? (
          <>
            <button onClick={isPlaying ? onPause : handlePlay} className="play-btn" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <audio
              ref={audioRef}
              src={ayah.audioUrl}
              onEnded={() => {
                if (typeof onEnded === 'function') onEnded(ayah.n);
              }}
              preload="none"
            />
          </>
        ) : (
          <span className="no-audio">Audio tidak tersedia</span>
        )}
      </div>
    </div>
  );
}

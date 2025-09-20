import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BOOKMARK_KEY = 'alquran.bookmarks';

function readBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}
function writeBookmarks(arr) { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr)); }

export default function Bookmark() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = readBookmarks().sort((a, b) => b.timestamp - a.timestamp);
    setItems(data);
  }, []);

  const remove = (idx) => {
    const updated = [...items];
    updated.splice(idx, 1);
    setItems(updated);
    writeBookmarks(updated);
  };

  return (
    <div className="container page-transition">
      <div className="actions actions--top">
        <h1 style={{margin: 0}}>Bookmark</h1>
        <Link to="/" className="btn-secondary">← Kembali ke daftar</Link>
      </div>

      {items.length === 0 && (
        <div className="empty">
          <p>Tidak ada bookmark.</p>
          <Link to="/" className="btn-secondary">Mulai jelajahi surah</Link>
        </div>
      )}

      {items.length > 0 && (
        <ul className="bookmark-list">
          {items.map((b, i) => (
            <li key={`${b.surahNumber}-${b.ayahNumberInSurah}-${b.timestamp}`} className="bookmark-item">
              <div className="bm-meta">
                <Link className="bm-link" to={`/surah/${b.surahNumber}#ayah-${b.ayahNumberInSurah}`}>
                  Surah {b.surahNumber}, Ayat {b.ayahNumberInSurah}
                </Link>
                <button className="remove-btn" onClick={() => remove(i)} aria-label="Hapus bookmark">Hapus</button>
              </div>
              <div className="ayah-text arab" dir="rtl">{b.arabText}</div>
              <div className="ayah-text id">{b.idText}</div>
              {b.audioUrl && (
                <audio controls src={b.audioUrl} preload="none" />
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="actions actions--bottom">
        <Link to="/" className="btn-secondary">← Kembali ke daftar</Link>
      </div>
    </div>
  );
}

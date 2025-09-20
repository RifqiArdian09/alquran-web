import { Link } from 'react-router-dom';

const BOOKMARK_KEY = 'alquran.bookmarks';

function readBookmarks() {
  try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; } catch { return []; }
}
function writeBookmarks(arr) { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(arr)); }

export default function Bookmark() {
  const items = readBookmarks().sort((a, b) => b.timestamp - a.timestamp);

  const remove = (idx) => {
    const list = readBookmarks();
    list.splice(idx, 1);
    writeBookmarks(list);
    // force refresh by reloading page state
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>Bookmark</h1>
      {items.length === 0 && <p>Tidak ada bookmark.</p>}
      <ul className="bookmark-list">
        {items.map((b, i) => (
          <li key={`${b.surahNumber}-${b.ayahNumberInSurah}-${b.timestamp}`} className="bookmark-item">
            <div className="bm-meta">
              <Link to={`/surah/${b.surahNumber}#ayah-${b.ayahNumberInSurah}`}>
                Surah {b.surahNumber}, Ayat {b.ayahNumberInSurah}
              </Link>
              <button className="remove-btn" onClick={() => remove(i)}>Hapus</button>
            </div>
            <div className="arab" dir="rtl">{b.arabText}</div>
            <div className="id">{b.idText}</div>
            {b.audioUrl && (
              <audio controls src={b.audioUrl} preload="none" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import SurahListItem from '../components/SurahListItem';
import { getAllSurah } from '../services/quranApi';
import { Link } from 'react-router-dom';

const LAST_READ_KEY = 'alquran.lastRead';

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    const lr = localStorage.getItem(LAST_READ_KEY);
    setLastRead(lr ? JSON.parse(lr) : null);
  }, []);

  const loadSurahs = useCallback(async () => {
    let mounted = true;
    setLoading(true);
    setError('');
    try {
      const data = await getAllSurah();
      if (mounted) setSurahs(data);
    } catch (e) {
      if (mounted) setError(e.message || 'Gagal memuat surah');
    } finally {
      if (mounted) setLoading(false);
    }
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let cleanup = () => {};
    loadSurahs().then((fn) => { if (typeof fn === 'function') cleanup = fn; });
    return () => cleanup();
  }, [loadSurahs]);

  const filtered = surahs.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      String(s.number).includes(q) ||
      s.englishName?.toLowerCase().includes(q) ||
      s.englishNameTranslation?.toLowerCase().includes(q) ||
      s.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container page-transition">
      <h1>Daftar Surah</h1>

      {lastRead && (
        <div className="last-read">
          <span>Terakhir dibaca:</span>
          <Link to={`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumberInSurah}`}>
            Surah {lastRead.surahNumber} Ayat {lastRead.ayahNumberInSurah}
          </Link>
        </div>
      )}

      <input
        className="search-input"
        placeholder="Cari surah (nama/nomor)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="skeleton-list">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="skeleton skeleton-card" key={i} />
          ))}
        </div>
      )}
      {error && (
        <div className="error-row">
          <p className="error">{error}</p>
          <button onClick={loadSurahs}>Coba Lagi</button>
        </div>
      )}

      <div className="surah-list">
        {filtered.map((s) => (
          <SurahListItem key={s.number} surah={s} />
        ))}
      </div>
    </div>
  );
}

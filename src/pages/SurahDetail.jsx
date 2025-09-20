import { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getSurahDualEdition } from '../services/quranApi';
import AyahItem from '../components/AyahItem';

export default function SurahDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingAyah, setPlayingAyah] = useState(null);
  const surahNumber = Number(id);
  const prevId = surahNumber > 1 ? String(surahNumber - 1) : null;
  const nextId = surahNumber < 114 ? String(surahNumber + 1) : null;

  const loadSurah = useCallback(async () => {
    let mounted = true;
    setLoading(true);
    setError('');
    setPlayingAyah(null);
    try {
      const d = await getSurahDualEdition(id);
      if (!mounted) return () => {};
      setData(d);
    } catch (e) {
      if (!mounted) return () => {};
      setError(e.message || 'Gagal memuat surah');
    } finally {
      if (mounted) setLoading(false);
    }
    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    let cleanup = () => {};
    loadSurah().then((fn) => { if (typeof fn === 'function') cleanup = fn; });
    return () => cleanup();
  }, [loadSurah]);

  // Scroll to hash if exists
  useEffect(() => {
    if (!data) return;
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, [location.hash, data]);

  // Scrollspy: when playingAyah changes, scroll that ayah into view
  useEffect(() => {
    if (!playingAyah) return;
    const el = document.getElementById(`ayah-${playingAyah}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [playingAyah]);

  const onPlay = (n) => setPlayingAyah(n);
  const onPause = () => setPlayingAyah(null);
  const onEnded = (n) => {
    if (!data) return;
    const next = n + 1;
    if (next <= data.meta.totalAyah) setPlayingAyah(next);
    else setPlayingAyah(null);
  };

  if (loading) return (
    <div className="container">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-list">
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="skeleton skeleton-card" key={i} />
        ))}
      </div>
    </div>
  );
  if (error) return (
    <div className="container">
      <div className="error-row">
        <p className="error">{error}</p>
        <button onClick={loadSurah}>Coba Lagi</button>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <div className="container page-transition">
      <div className="actions actions--top">
        <Link to="/" className="btn-secondary">← Kembali ke daftar</Link>
        <div className="actions__group">
          {prevId && <Link to={`/surah/${prevId}`} className="btn-secondary">← Sebelumnya</Link>}
          {nextId && <Link to={`/surah/${nextId}`} className="btn-secondary">Berikutnya →</Link>}
        </div>
      </div>
      <div className="surah-meta">
        <div className="name-ar">{data.meta.nameAr}</div>
        <div className="name-lat">{data.meta.nameLat} • {data.meta.translation} • {data.meta.totalAyah} ayat</div>
      </div>
      <div className="ayah-list">
        {data.ayahs.map((a) => (
          <AyahItem
            key={a.n}
            surahNumber={data.meta.number}
            ayah={a}
            isPlaying={playingAyah === a.n}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
          />
        ))}
      </div>
      <div className="actions actions--bottom">
        <Link to="/" className="btn-secondary">← Kembali ke daftar</Link>
        <div className="actions__group">
          {prevId && <Link to={`/surah/${prevId}`} className="btn-secondary">← Sebelumnya</Link>}
          {nextId && <Link to={`/surah/${nextId}`} className="btn-secondary">Berikutnya →</Link>}
        </div>
      </div>
    </div>
  );
}

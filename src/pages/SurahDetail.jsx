import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getSurahDualEdition } from '../services/quranApi';
import AyahItem from '../components/AyahItem';

export default function SurahDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingAyah, setPlayingAyah] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      setPlayingAyah(null);
      try {
        const d = await getSurahDualEdition(id);
        if (!mounted) return;
        setData(d);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Gagal memuat surah');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

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

  const title = useMemo(() => {
    if (!data) return '';
    return `${data.meta.englishName || data.meta.nameAr || 'Surah'} (${data.meta.number})`;
  }, [data]);

  const onPlay = (n) => setPlayingAyah(n);
  const onPause = () => setPlayingAyah(null);

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
        <button onClick={() => window.location.reload()}>Coba Lagi</button>
      </div>
    </div>
  );
  if (!data) return null;

  return (
    <div className="container">
      <h1>{title}</h1>
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
          />
        ))}
      </div>
    </div>
  );
}

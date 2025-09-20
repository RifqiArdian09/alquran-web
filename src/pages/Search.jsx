import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSurah, getSurahDualEdition } from '../services/quranApi';

export default function Search() {
  const [surahs, setSurahs] = useState([]);
  const [querySurah, setQuerySurah] = useState('');
  const [loadingSurah, setLoadingSurah] = useState(true);
  const [errorSurah, setErrorSurah] = useState('');

  const [selectedSurah, setSelectedSurah] = useState('');
  const [queryAyah, setQueryAyah] = useState('');
  const [ayahData, setAyahData] = useState(null);
  const [loadingAyah, setLoadingAyah] = useState(false);
  const [errorAyah, setErrorAyah] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingSurah(true);
      setErrorSurah('');
      try {
        const data = await getAllSurah();
        if (mounted) setSurahs(data);
      } catch (e) {
        if (mounted) setErrorSurah(e.message || 'Gagal memuat surah');
      } finally {
        if (mounted) setLoadingSurah(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filteredSurah = useMemo(() => {
    const q = querySurah.toLowerCase();
    return surahs.filter((s) =>
      !q || String(s.number).includes(q) || s.englishName?.toLowerCase().includes(q) || s.name?.toLowerCase().includes(q)
    );
  }, [surahs, querySurah]);

  const loadAyah = async (num) => {
    if (!num) return;
    setLoadingAyah(true);
    setErrorAyah('');
    try {
      const d = await getSurahDualEdition(num);
      setAyahData(d);
    } catch (e) {
      setErrorAyah(e.message || 'Gagal memuat ayat');
    } finally {
      setLoadingAyah(false);
    }
  };

  useEffect(() => {
    if (selectedSurah) loadAyah(selectedSurah);
  }, [selectedSurah]);

  const filteredAyah = useMemo(() => {
    if (!ayahData || !queryAyah) return ayahData?.ayahs || [];
    const q = queryAyah.toLowerCase();
    return ayahData.ayahs.filter((a) =>
      a.arabText?.toLowerCase().includes(q) || a.idText?.toLowerCase().includes(q)
    );
  }, [ayahData, queryAyah]);

  return (
    <div className="container">
      <h1>Pencarian</h1>

      <section>
        <h2>Cari Surah</h2>
        <input
          className="search-input"
          placeholder="Nama/nomor surah"
          value={querySurah}
          onChange={(e) => setQuerySurah(e.target.value)}
        />
        {loadingSurah && (
          <div className="skeleton-list">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton skeleton-card" key={i} />
            ))}
          </div>
        )}
        {errorSurah && (
          <div className="error-row">
            <p className="error">{errorSurah}</p>
            <button onClick={() => window.location.reload()}>Coba Lagi</button>
          </div>
        )}
        <ul className="list">
          {filteredSurah.slice(0, 50).map((s) => (
            <li key={s.number}>
              <Link to={`/surah/${s.number}`}>{s.number}. {s.englishName} ({s.name})</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Cari Ayat dalam Surah</h2>
        <div className="row">
          <select value={selectedSurah} onChange={(e) => setSelectedSurah(e.target.value)}>
            <option value="">Pilih Surah</option>
            {surahs.map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.englishName}
              </option>
            ))}
          </select>
          <input
            className="search-input"
            placeholder="Kata kunci ayat (Arab/Indonesia)"
            value={queryAyah}
            onChange={(e) => setQueryAyah(e.target.value)}
            disabled={!selectedSurah}
          />
        </div>
        {loadingAyah && (
          <div className="skeleton-list">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton skeleton-card" key={i} />
            ))}
          </div>
        )}
        {errorAyah && (
          <div className="error-row">
            <p className="error">{errorAyah}</p>
            <button onClick={() => loadAyah(selectedSurah)}>Coba Lagi</button>
          </div>
        )}
        {selectedSurah && !loadingAyah && (
          <ul className="list">
            {filteredAyah.slice(0, 100).map((a) => (
              <li key={a.n}>
                <Link to={`/surah/${selectedSurah}#ayah-${a.n}`}>
                  Ayat {a.n}: {a.idText}
                </Link>
              </li>
            ))}
            {filteredAyah.length === 0 && <li>Tidak ada hasil</li>}
          </ul>
        )}
      </section>
    </div>
  );
}

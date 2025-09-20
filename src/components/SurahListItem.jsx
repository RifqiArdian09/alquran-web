import { Link } from 'react-router-dom';

export default function SurahListItem({ surah }) {
  return (
    <Link to={`/surah/${surah.number}`} className="surah-item">
      <div className="surah-item__num">{surah.number}</div>
      <div className="surah-item__main">
        <div className="surah-item__title">
          <span className="latin">{surah.englishName}</span>
          <span className="arab">{surah.name}</span>
        </div>
        <div className="surah-item__meta">
          <span className="translation">{surah.englishNameTranslation}</span>
          <span className="count">{surah.numberOfAyahs} ayat</span>
        </div>
      </div>
    </Link>
  );
}

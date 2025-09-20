const BASE = 'https://api.alquran.cloud/v1';

async function fetchJson(url) {
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.status !== 'OK') {
    throw new Error(json?.data || json?.message || `Gagal memuat: ${url}`);
  }
  return json.data;
}

export async function getAllSurah() {
  return fetchJson(`${BASE}/surah`);
}

export async function getSurahArabic(number) {
  return fetchJson(`${BASE}/surah/${number}/ar.alafasy`);
}

export async function getSurahIndonesian(number) {
  return fetchJson(`${BASE}/surah/${number}/id.indonesian`);
}

export async function getSurahDualEdition(number) {
  const [ar, id] = await Promise.all([
    getSurahArabic(number),
    getSurahIndonesian(number),
  ]);
  const arAyahs = ar.ayahs || [];
  const idAyahs = id.ayahs || [];
  const mergedAyahs = arAyahs.map((a, i) => ({
    n: a.numberInSurah,
    arabText: a.text,
    idText: idAyahs[i]?.text || '',
    audioUrl: a.audio || a.audioSecondary?.[0] || null,
  }));
  return {
    meta: {
      number: ar.number,
      nameAr: ar.name,
      nameLat: ar.englishName,
      translation: ar.englishNameTranslation,
      totalAyah: ar.numberOfAyahs,
      revelationType: ar.revelationType,
    },
    ayahs: mergedAyahs,
  };
}

export function filterSurah(list, query) {
  if (!query) return list;
  const q = query.toLowerCase();
  return list.filter((s) =>
    String(s.number).includes(q) ||
    s.englishName?.toLowerCase().includes(q) ||
    s.englishNameTranslation?.toLowerCase().includes(q) ||
    s.name?.toLowerCase().includes(q)
  );
}

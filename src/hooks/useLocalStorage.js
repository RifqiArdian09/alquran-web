import { useEffect, useState } from 'react';

// Generic localStorage hook
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn('useLocalStorage read error', err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.warn('useLocalStorage write error', err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

// Helpers for theme persistence
export function useTheme(key = 'alquran.theme') {
  const [theme, setTheme] = useLocalStorage(key, 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  return [theme, setTheme];
}

// Accent color management
export function useAccent(key = 'alquran.accent') {
  const [accent, setAccent] = useLocalStorage(key, 'indigo'); // indigo | emerald | amber

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
  }, [accent]);

  return [accent, setAccent];
}

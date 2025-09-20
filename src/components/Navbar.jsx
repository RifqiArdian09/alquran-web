import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useLocalStorage';
import './navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="brand">Al-Qur'an</Link>
        <nav className="links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/bookmark">Bookmark</NavLink>
        </nav>
        {/* Accent selector removed for minimal UI */}
        <button
          className="theme-btn icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45 14.32l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM12 4V1h-0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM19.16 6.76l1.8-1.79-1.41-1.41-1.79 1.8 1.4 1.4zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
            </svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21.64 13A9 9 0 1111 2.36 7 7 0 0021.64 13z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}

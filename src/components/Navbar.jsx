import { Link, NavLink } from 'react-router-dom';
import { useTheme, useAccent } from '../hooks/useLocalStorage';
import './navbar.css';

export default function Navbar() {
  const [theme, setTheme] = useTheme();
  const [accent, setAccent] = useAccent();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="brand">Al-Qur'an</Link>
        <nav className="links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/bookmark">Bookmark</NavLink>
        </nav>
        <select aria-label="Accent" value={accent} onChange={(e) => setAccent(e.target.value)}>
          <option value="indigo">Indigo</option>
          <option value="emerald">Emerald</option>
          <option value="amber">Amber</option>
        </select>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </header>
  );
}

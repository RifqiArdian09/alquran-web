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
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/bookmark">Bookmark</NavLink>
        </nav>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>
    </header>
  );
}

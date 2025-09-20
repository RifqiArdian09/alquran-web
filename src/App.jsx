import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SurahDetail from './pages/SurahDetail';
import Search from './pages/Search';
import Bookmark from './pages/Bookmark';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:id" element={<SurahDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/bookmark" element={<Bookmark />} />
        </Routes>
      </main>
    </>
  );
}

export default App

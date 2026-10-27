import { useState } from 'react';

import Home from './pages/Home.jsx';
import Stats from './pages/Stats.jsx';
import About from './pages/About.jsx';
import Footer from './components/Footer.jsx';

import ProcessHaloMultiplayer from './components/ProcessHaloMultiplayer.jsx';
import mockDump from './data/mockdump.json';

export default function App() {
  const [page, setPage] = useState('home');

  const [player, setPlayer] = useState(
    ProcessHaloMultiplayer(mockDump)
  );

  const search = (gamertag) => {
    setPlayer({
      ...ProcessHaloMultiplayer(mockDump),
      gamertag
    });

    setPage('stats');
  };

  return (
    <div className="app-shell">

      {page === 'home' && (
        <Home onSearch={search} />
      )}

      {page === 'stats' && (
        <Stats
          player={player}
          onSearch={search}
        />
      )}

      {page === 'about' && (
        <About />
      )}

      <Footer
        onAbout={() => setPage('about')}
      />

      {page !== 'home' && (
        <button
          className="home-fab"
          onClick={() => setPage('home')}
        >
          Home
        </button>
      )}

    </div>
  );
}
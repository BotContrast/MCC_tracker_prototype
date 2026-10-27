import { useState } from 'react';

import GameSidebar from '../components/GameSidebar.jsx';
import PlayerHeader from '../components/PlayerHeader.jsx';
import StatCard from '../components/StatCard.jsx';

export default function Stats({ player, onSearch }) {
  const [mode, setMode] = useState('multiplayer');
  const [game, setGame] = useState('mcc');
  const [query, setQuery] = useState(player.gamertag);

  const submit = (e) => {
    e.preventDefault();

    onSearch(
      query.trim() || player.gamertag
    );
  };

  return (
    <div className="stats-page">
      <header className="top-bar">
        <div className="title-section">
          <h1>
            MCC Player Tracker
          </h1>

          <p className="subtitle">
            The best place to view your stats from Halo: The Master Chief Collection
          </p>
        </div>

        <form
          className="search-bar"
          onSubmit={submit}
        >
          <input
            aria-label="Search player"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit">
            SEARCH
          </button>
        </form>

        <PlayerHeader
          player={player}
        />
      </header>

      <main className="main-content">
        <GameSidebar
          games={player.games}
          selectedGame={game}
          onSelect={setGame}
        />

        <section className="stats-section">
          <div className="selection-title">
            {player.games.find(
              (g) => g.id === game
            )?.name}
            {' — '}
            {mode === 'multiplayer'
              ? 'Multiplayer'
              : 'Campaign'}
          </div>

          <div className="mode-buttons">
            <button
              className={`mode-btn ${
                mode === 'multiplayer'
                  ? 'active'
                  : ''
              }`}
              onClick={() => setMode('multiplayer')}
            >
              Multiplayer
            </button>

            <button
              className={`mode-btn ${
                mode === 'campaign'
                  ? 'active'
                  : ''
              }`}
              onClick={() => setMode('campaign')}
            >
              Campaign
            </button>
          </div>

          <div className="stats-grid">
      {Object.entries(
  player.stats[game]?.[mode] || {}
).map(
  ([label, value]) => (
    <StatCard
      key={label}
      label={label}
      value={value}
    />
  )
)}
          </div>
        </section>
      </main>
    </div>
  );
}
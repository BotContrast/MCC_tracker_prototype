import { useState } from 'react';

export default function Home({ onSearch }) {
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();

    onSearch(
      name.trim() || 'Bot Contrast'
    );
  };

  return (
    <main className="hero">
      <div className="content">
        <h1>
          MCC Player Tracker
        </h1>

        <p className="subtitle">
          The best place to view your stats from Halo: The Master Chief Collection
        </p>

        <form
          className="search-container"
          onSubmit={submit}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search Player"
          />

          <button type="submit">
            Search
          </button>
        </form>
      </div>
    </main>
  );
}
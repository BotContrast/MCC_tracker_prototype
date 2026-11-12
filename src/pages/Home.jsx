export default function Home({ onSearch, loading, error }) {

  const submit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const gamertag = formData.get('gamertag');

    onSearch(gamertag);
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
            type="text"
            name="gamertag"
            placeholder="Search Player"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>

        </form>

        {loading && (
          <p className="loading-message">
            Retrieving player statistics...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      </div>

    </main>
  );
}

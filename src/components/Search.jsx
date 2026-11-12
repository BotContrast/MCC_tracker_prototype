
import { useState } from 'react';
import ProcessHaloMultiplayer from '../utils/ProcessHaloMultiplayer.jsx';

const API_URL = 'http://localhost:5000';

export default function Search({ onPlayerFound }) {
  const [gamertag, setGamertag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Send a request to the backend and return its response
  const request = async (url, options = {}) => {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);

    return { response, data };
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const username = gamertag.trim();

    if (!username) {
      setError('Please enter a gamertag.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const encodedGamertag = encodeURIComponent(username);

      // 1. Check whether the player exists in MongoDB
      let { response: playerResponse, data: playerData } =
        await request(`${API_URL}/api/players/${encodedGamertag}`);

      // If the player doesn't exist, import their data
      if (playerResponse.status === 404) {
        // Import multiplayer data first.
        // This also creates the Player document.
        const multiplayerImport = await request(
          `${API_URL}/api/import/${encodedGamertag}/multiplayer`,
          { method: 'POST' }
        );

        if (!multiplayerImport.response.ok) {
          throw new Error(
            multiplayerImport.data?.message ||
            'Could not import multiplayer data.'
          );
        }

        // Import campaign data after the player exists
        const campaignImport = await request(
          `${API_URL}/api/import/${encodedGamertag}/campaign`,
          { method: 'POST' }
        );

        if (!campaignImport.response.ok) {
          throw new Error(
            campaignImport.data?.message ||
            'Could not import campaign data.'
          );
        }

        // Retrieve the newly created player from MongoDB
        const result = await request(
          `${API_URL}/api/players/${encodedGamertag}`
        );

        if (!result.response.ok) {
          throw new Error('Could not retrieve the imported player.');
        }

        playerData = result.data;
      } else if (!playerResponse.ok) {
        throw new Error(
          playerData?.message || 'Could not search for this player.'
        );
      }

      // 2. Retrieve the player's stored multiplayer data
      let multiplayerResult = await request(
        `${API_URL}/api/players/${encodedGamertag}/multiplayer`
      );

      // If multiplayer data is missing, import it
      if (multiplayerResult.response.status === 404) {
        multiplayerResult = await request(
          `${API_URL}/api/import/${encodedGamertag}/multiplayer`,
          { method: 'POST' }
        );

        if (!multiplayerResult.response.ok) {
          throw new Error('Could not retrieve multiplayer statistics.');
        }

        // Retrieve the stored version after importing
        multiplayerResult = await request(
          `${API_URL}/api/players/${encodedGamertag}/multiplayer`
        );
      }

      if (!multiplayerResult.response.ok) {
        throw new Error('Could not retrieve multiplayer statistics.');
      }

      // 3. Retrieve campaign data
      const campaignResult = await request(
        `${API_URL}/api/players/${encodedGamertag}/campaign`
      );

      const campaignData = campaignResult.response.ok
        ? campaignResult.data
        : null;

      // 4. Process the raw multiplayer data
      const rawData =
        multiplayerResult.data?.data ?? multiplayerResult.data;

      const processedPlayer = ProcessHaloMultiplayer(rawData);

      // 5. Add the remaining player information
      const finalPlayer = {
        ...processedPlayer,
        gamertag: playerData.gamertag,
        playerDetails: playerData.playerDetails,
        ranks: playerData.ranks,
        xp: playerData.xp,
        minutesPlayed: playerData.minutesPlayed,
        campaign: campaignData
      };

      // 6. Send the player to App.jsx to open the Stats page
      onPlayerFound(finalPlayer);

    } catch (err) {
      console.error('Player search error:', err);
      setError(err.message || 'Something went wrong while searching.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        value={gamertag}
        onChange={(e) => setGamertag(e.target.value)}
        placeholder="Enter your Xbox gamertag"
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'LOADING...' : 'SEARCH'}
      </button>

      {error && (
        <p className="search-error">{error}</p>
      )}
    </form>
  );
}

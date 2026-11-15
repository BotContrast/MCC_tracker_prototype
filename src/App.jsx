import { useState } from 'react';

import Home from './pages/Home.jsx';
import Stats from './pages/Stats.jsx';
import About from './pages/About.jsx';
import Footer from './components/Footer.jsx';

import ProcessHaloMultiplayer from './components/ProcessHaloMultiplayer.jsx';
import ProcessHaloCampaign from './components/ProcessHaloCampaign.jsx';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [player, setPlayer] = useState(null);
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Make a request to the backend
  const apiRequest = async (url, options = {}) => {
    const response = await fetch(url, options);

    const data = await response.json().catch(() => null);

    return {
      response,
      data
    };
  };

  // Search for a player
  const search = async (gamertag) => {
    const username = gamertag.trim();

    if (!username) {
      setError('Please enter a gamertag.');
      return;
    }

    const encodedGamertag = encodeURIComponent(username);

    setLoading(true);
    setError('');

    try {
      // 1. Check whether the player exists in MongoDB
      let playerResult = await apiRequest(
        `${API_URL}/api/players/${encodedGamertag}`
      );

      // 2. If the player doesn't exist, import their data
      if (playerResult.response.status === 404) {
        console.log('Player not found. Importing player data...');

        // Import multiplayer first.
        // This also creates the Player document.
        const multiplayerImport = await apiRequest(
          `${API_URL}/api/import/${encodedGamertag}/multiplayer`,
          { method: 'POST' }
        );

        if (!multiplayerImport.response.ok) {
          throw new Error(
            multiplayerImport.data?.error ||
            multiplayerImport.data?.message ||
            'Failed to import multiplayer data.'
          );
        }

        // Import campaign data
        const campaignImport = await apiRequest(
          `${API_URL}/api/import/${encodedGamertag}/campaign`,
          { method: 'POST' }
        );

        if (!campaignImport.response.ok) {
          throw new Error(
            campaignImport.data?.error ||
            campaignImport.data?.message ||
            'Failed to import campaign data.'
          );
        }

        // Retrieve the newly created player
        playerResult = await apiRequest(
          `${API_URL}/api/players/${encodedGamertag}`
        );
      }

      if (!playerResult.response.ok) {
        throw new Error(
          playerResult.data?.error ||
          playerResult.data?.message ||
          'Could not retrieve player information.'
        );
      }

      const playerData = playerResult.data;

      // 3. Retrieve multiplayer statistics from MongoDB
      let multiplayerResult = await apiRequest(
        `${API_URL}/api/players/${encodedGamertag}/multiplayer`
      );

      // Import multiplayer data if it is missing
      if (multiplayerResult.response.status === 404) {
        const multiplayerImport = await apiRequest(
          `${API_URL}/api/import/${encodedGamertag}/multiplayer`,
          { method: 'POST' }
        );

        if (!multiplayerImport.response.ok) {
          throw new Error('Failed to import multiplayer statistics.');
        }

        // Retrieve the saved multiplayer data
        multiplayerResult = await apiRequest(
          `${API_URL}/api/players/${encodedGamertag}/multiplayer`
        );
      }

      if (!multiplayerResult.response.ok) {
        throw new Error(
          multiplayerResult.data?.error ||
          'Could not retrieve multiplayer statistics.'
        );
      }

      const multiplayerData = multiplayerResult.data;

      // 4. Retrieve campaign statistics
      const campaignResult = await apiRequest(
        `${API_URL}/api/players/${encodedGamertag}/campaign`
      );

      if (!campaignResult.response.ok) {
        throw new Error(
          campaignResult.data?.error ||
          'Could not retrieve campaign statistics.'
        );
      }

      const campaignData = campaignResult.data;

      // Process multiplayer statistics
      const rawMultiplayer = multiplayerData.data ?? multiplayerData;
      const processedPlayer = ProcessHaloMultiplayer(rawMultiplayer);

      // Process campaign statistics
      const rawCampaign = campaignData?.data ?? campaignData;
      const processedCampaign = ProcessHaloCampaign(rawCampaign);

      // Combine multiplayer and campaign statistics
      const combinedStats = { ...processedPlayer.stats };

      for (const [game, campaignStats] of Object.entries(processedCampaign)) {
        combinedStats[game] = {
          ...combinedStats[game],
          campaign: campaignStats
        };
      }

      // Create final player object
      const finalPlayer = {
        ...processedPlayer,
      
        gamertag: playerData.gamertag,
        playerDetails: playerData.playerDetails,
        ranks: playerData.ranks,
        xp: playerData.xp,
        minutesPlayed: playerData.minutesPlayed,
      
        stats: combinedStats
      };

      setPlayer(finalPlayer);
      setPage('stats');

      // 7. Open the Stats page
      setPlayer(finalPlayer);
      setPage('stats');

    } catch (err) {
      console.error('Player search error:', err);
      setError(err.message || 'Something went wrong.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">

      {/* Home page */}
      {page === 'home' && (
        <Home
          onSearch={search}
          loading={loading}
          error={error}
        />
      )}

      {/* Player statistics page */}
      {page === 'stats' && player && (
        <Stats
          player={player}
          onSearch={search}
        />
      )}

      {/* About page */}
      {page === 'about' && (
        <About />
      )}

      {/* Footer */}
      <Footer
        onAbout={() => {
          setError('');
          setPage('about');
        }}
      />

      {/* Home navigation button */}
      {page !== 'home' && (
        <button
          className="home-fab"
          onClick={() => {
            setError('');
            setPage('home');
          }}
        >
          Home
        </button>
      )}

    </div>
  );
}

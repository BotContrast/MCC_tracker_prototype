export default function ProcessHaloMultiplayer(rawData) {
  // Get multiplayer data
  const multiplayerData =
    rawData?.data?.stats?.Multiplayer ??
    rawData?.stats?.Multiplayer ??
    {};

  const matchmaking = multiplayerData.Matchmaking ?? {};

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');
  };

  const getStats = (game) => {
    const stats = matchmaking?.[game]?.Stats ?? {};

    if (Object.keys(stats).length === 0) {
      return null;
    }

    return {
      matchesPlayed: stats.games_completed ?? 0,

      timePlayed: formatTime(
        stats.time_played_MS ?? 0
      ),

      wins: stats.games_won ?? 0,

      losses:
        (stats.games_completed ?? 0) -
        (stats.games_won ?? 0),

      kills: stats.kills ?? 0,

      deaths: stats.deaths ?? 0,

      assists: stats.assists ?? 0
    };
  };

  return {
    _id: rawData?.xuid ?? null,

    gamertag: rawData?.gamertag ?? null,

    rank: 'Tour10-21.png',

    nameplate: 'nameplate.png',

    lastUpdated:
      rawData?.player_details?.last_updated ?? null,

    games: [
      { id: 'mcc', name: 'All', image: 'mcc.png' },
      { id: 'halo_ce', name: 'Halo CE', image: 'haloce.png' },
      { id: 'halo_2', name: 'Halo 2', image: 'halo2.png' },
      { id: 'halo_2a', name: 'Halo 2A', image: 'halo2a.png' },
      { id: 'halo_3', name: 'Halo 3', image: 'halo3.png' },
      { id: 'halo_3_odst', name: 'Halo 3 ODST', image: 'odst.png' },
      { id: 'halo_4', name: 'Halo 4', image: 'halo4.png' },
      { id: 'halo_reach', name: 'Halo Reach', image: 'reach.png' }
    ],

    stats: {
      mcc: {multiplayer: getStats('All')},
      halo_ce: {multiplayer: getStats('Halo1')},
      halo_2: {multiplayer: getStats('Halo2')},
      halo_2a: {multiplayer: getStats('Halo2A')},
      halo_3: {multiplayer: getStats('Halo3')},
      halo_3_odst: {multiplayer: getStats('Halo3')},
      halo_4: {multiplayer: getStats('Halo4')},
      halo_reach: {multiplayer: getStats('HaloReach')}
    }
  };
}

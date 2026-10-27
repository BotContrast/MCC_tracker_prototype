export default function ProcessHaloMultiplayer(rawData) {
  const matchmaking =
    rawData.stats?.Multiplayer?.Matchmaking;

  const getStats = (game) => {
    const stats = matchmaking?.[game]?.Stats;

    if (!stats) {
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
      _id: rawData.xuid,

      gamertag: rawData.gamertag,

      rank: '/images/Tour10-21.png',

      nameplate: '/images/nameplate.png',

      lastUpdated:
        rawData.player_details?.last_updated ?? null,

      games: [
      {
        id: 'mcc',
        name: 'All',
        image: 'mcc.png'
      },
      {
        id: 'halo_ce',
        name: 'Halo CE',
        image: 'haloce.png'
      },
      {
        id: 'halo_2',
        name: 'Halo 2',
        image: 'halo2.png'
      },
      {
        id: 'halo_2a',
        name: 'Halo 2A',
        image: 'halo2a.png'
      },
      {
        id: 'halo_3',
        name: 'Halo 3',
        image: 'halo3.png'
      },
      {
        id: 'halo_3_odst',
        name: 'Halo 3 ODST',
        image: 'odst.png'
      },
      {
        id: 'halo_4',
        name: 'Halo 4',
        image: 'halo4.png'
      },
      {
        id: 'halo_reach',
        name: 'Halo Reach',
        image: 'reach.png'
      }
    ],

    stats: {
      mcc: {
        campaign: {},

        multiplayer: getStats('All')
      },

      halo_ce: {
        campaign: {},

        multiplayer: getStats('Halo1')
      },

      halo_2: {
        campaign: {},

        multiplayer: getStats('Halo2')
      },

      halo_2a: {
        campaign: {},

        multiplayer: getStats('Halo2A')
      },

      halo_3: {
        campaign: {},

        multiplayer: getStats('Halo3')
      },

      halo_3_odst: {
        campaign: {},

        multiplayer: null
      },

      halo_4: {
        campaign: {},

        multiplayer: getStats('Halo4')
      },

      halo_reach: {
        campaign: {},

        multiplayer: getStats('HaloReach')
      }
    }
  };
}


function formatTime(milliseconds) {
  const totalSeconds =
    Math.floor(milliseconds / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].join(':');
}
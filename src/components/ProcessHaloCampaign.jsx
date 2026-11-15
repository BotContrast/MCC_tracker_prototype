export default function ProcessHaloCampaign(rawData) {
  const campaignData =
    rawData?.data?.stats?.Campaign ??
    rawData?.stats?.Campaign ??
    {};

  const campaign = campaignData.Campaign ?? {};
  const playlists = campaignData.Playlists ?? {};

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

  const getCombinedTime = (difficulty) => {
  const games = [
    'Halo1',
    'Halo2',
    'Halo3',
    'Halo3ODST',
    'Halo4',
    'HaloReach'
  ];

  const totalTime = games.reduce((total, game) => {
    const missionTimes =
      campaign?.[game]?.MissionTimes?.[difficulty];

    if (!missionTimes) return total;

    const gameTime = Object.values(missionTimes)
      .filter(time => typeof time === 'number')
      .reduce((sum, time) => sum + time, 0);

    return total + gameTime;
  }, 0);

  return totalTime > 0 ? formatTime(totalTime) : null;
};

  const getStats = (game) => {
    const campaignStats = campaign?.[game]?.Stats ?? {};
    const playlistStats = playlists?.[game]?.Stats ?? {};

    const hasCampaignStats =
      Object.keys(campaignStats).length > 0;

    const hasPlaylistStats =
      Object.keys(playlistStats).length > 0;

    if (!hasCampaignStats && !hasPlaylistStats) {
      return null;
    }

    // Combine Campaign and Playlist statistics
    const combinedStats = { ...campaignStats };

    Object.entries(playlistStats).forEach(([key, value]) => {
      if (typeof value !== 'number') return;

      if (key === 'best_skull_multiplier') {
        combinedStats[key] = Math.max(
          combinedStats[key] ?? 0,
          value
        );
      } else {
        combinedStats[key] = (combinedStats[key] ?? 0) + value;
      }
    });

    // Calculate total mission time for each difficulty
    const getTotalTime = (difficulty) => {
      const missionTimes =
        campaign?.[game]?.MissionTimes?.[difficulty];

      if (
        !missionTimes ||
        typeof missionTimes !== 'object' ||
        Array.isArray(missionTimes)
      ) {
        return null;
      }

      const totalTime = Object.values(missionTimes)
        .filter(time => typeof time === 'number')
        .reduce((total, time) => total + time, 0);

      return formatTime(totalTime);
    };

    return {
      missionsCompleted: campaignStats.missions_completed ?? 0,
      kills: combinedStats.kills ?? 0,
      deaths: combinedStats.deaths ?? 0,
      timePlayed: formatTime( combinedStats.time_played_MS ?? 0),
      easyCompletionTime: getTotalTime('Easy'),
      normalCompletionTime: getTotalTime('Normal'),
      heroicCompletionTime: getTotalTime('Heroic'),
      legendaryCompletionTime: getTotalTime('Legendary'),
      totalScore:
        combinedStats.total_mission_score ??
        combinedStats.total_score ??
        0,
        easyCompletionTime: game === 'All'
          ? getCombinedTime('Easy')
          : getTotalTime('Easy'),

        normalCompletionTime: game === 'All'
          ? getCombinedTime('Normal')
          : getTotalTime('Normal'),

        heroicCompletionTime: game === 'All'
          ? getCombinedTime('Heroic')
          : getTotalTime('Heroic'),

        legendaryCompletionTime: game === 'All'
          ? getCombinedTime('Legendary')
          : getTotalTime('Legendary')
    };
  };

  return {
    mcc: getStats('All'),
    halo_ce: getStats('Halo1'),
    halo_2: getStats('Halo2'),
    halo_2a: getStats('Halo2'),
    halo_3: getStats('Halo3'),
    halo_3_odst: getStats('Halo3ODST'),
    halo_4: getStats('Halo4'),
    halo_reach: getStats('HaloReach')
  };
}

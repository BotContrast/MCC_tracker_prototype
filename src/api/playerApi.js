const API_URL = "http://localhost:5000";

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve player data");
    }

    return data;
}

export async function getPlayerData(gamertag) {
    const encodedGamertag = encodeURIComponent(gamertag.trim());

    // Retrieve player and multiplayer information
    const [player, multiplayer] = await Promise.all([
        fetchData(`${API_URL}/api/players/${encodedGamertag}`),
        fetchData(`${API_URL}/api/players/${encodedGamertag}/multiplayer`)
    ]);

    // Campaign data may not have been imported yet
    let campaign = null;

    try {
        campaign = await fetchData(
            `${API_URL}/api/players/${encodedGamertag}/campaign`
        );
    } catch (error) {
        console.warn("Campaign statistics unavailable:", error.message);
    }

    return {
        player,
        multiplayer,
        campaign
    };
}

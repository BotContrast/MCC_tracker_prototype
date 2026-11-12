import { useState } from "react";

function ImportStats() {
    const [gamertag, setGamertag] = useState("Bot Contrast");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const importStats = async () => {
        setLoading(true);
        setMessage("");

        try {
            const encodedGamertag = encodeURIComponent(gamertag.trim());

            // Import multiplayer statistics
            const multiplayerResponse = await fetch(
                `http://localhost:5000/api/import/${encodedGamertag}/multiplayer`,
                {
                    method: "POST"
                }
            );

            const multiplayerResult = await multiplayerResponse.json();

            if (!multiplayerResponse.ok) {
                throw new Error(
                    multiplayerResult.error || "Multiplayer import failed"
                );
            }

            // Import campaign statistics
            const campaignResponse = await fetch(
                `http://localhost:5000/api/import/${encodedGamertag}/campaign`,
                {
                    method: "POST"
                }
            );

            const campaignResult = await campaignResponse.json();

            if (!campaignResponse.ok) {
                throw new Error(
                    campaignResult.error || "Campaign import failed"
                );
            }

            setMessage(
                "Successfully imported multiplayer and campaign statistics!"
            );

            console.log("Multiplayer:", multiplayerResult);
            console.log("Campaign:", campaignResult);

        } catch (error) {
            setMessage(error.message);
            console.error("Import error:", error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Import Player Statistics</h2>

            <input
                type="text"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                placeholder="Enter Xbox gamertag"
            />

            <button
                onClick={importStats}
                disabled={loading || !gamertag.trim()}
            >
                {loading ? "Importing..." : "Import Stats"}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default ImportStats;

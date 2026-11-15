import express from "express";

import Player from "../models/Player.js";
import Multiplayer from "../models/Multiplayer.js";
import Campaign from "../models/Campaign.js";

const router = express.Router();


// Import multiplayer statistics
router.post("/import/:gamertag/multiplayer", async (req, res) => {
    try {
        const gamertag = req.params.gamertag.trim();
        const gamertagLower = gamertag.toLowerCase();

        console.log(`Importing multiplayer stats for ${gamertag}`);

        // Fetch data from Wort.gg
        const response = await fetch(
            `https://wort.gg/api/stats/${encodeURIComponent(gamertag)}/multiplayer`
        );

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Wort.gg returned status ${response.status}`
            });
        }

        const data = await response.json();

        if (!data.gamertag || !data.stats) {
            return res.status(502).json({
                error: "Unexpected multiplayer response from Wort.gg"
            });
        }

        // Create or update player information
        const player = await Player.findOneAndUpdate(
            { gamertagLower },
            {
                $set: {
                    gamertag: data.gamertag,
                    gamertagLower,
                    xuid: data.xuid,
                    playerDetails: data.player_details,
                    ranks: data.ranks,
                    xp: data.xp,
                    minutesPlayed: data.minutes_played,
                    banned: data.banned,
                    banReason: data.ban_reason,
                    vip: data.vip,
                    leaderboards: data.leaderboards,
                    lastUpdated: new Date()
                }
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        // Store the complete multiplayer response
        const multiplayer = await Multiplayer.findOneAndUpdate(
            { playerId: player._id },
            {
                $set: {
                    data: data,
                    lastUpdated: new Date()
                }
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Multiplayer statistics imported successfully",
            gamertag: player.gamertag,
            xuid: player.xuid,
            playerId: player._id,
            multiplayerId: multiplayer._id
        });

        console.log(`Successfully imported ${gamertag}`);

    } catch (error) {
        console.error("Import error:", error);

        res.status(500).json({
            error: "Failed to import multiplayer statistics",
            details: error.message
        });
    }
});


// Retrieve player information
router.get("/players/:gamertag", async (req, res) => {
    try {
        const player = await Player.findOne({
            gamertagLower: req.params.gamertag.toLowerCase()
        });

        if (!player) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        res.json(player);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Retrieve multiplayer statistics
router.get("/players/:gamertag/multiplayer", async (req, res) => {
    try {
        const player = await Player.findOne({
            gamertagLower: req.params.gamertag.toLowerCase()
        });

        if (!player) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        const multiplayer = await Multiplayer.findOne({
            playerId: player._id
        });

        if (!multiplayer) {
            return res.status(404).json({
                error: "Multiplayer statistics not found"
            });
        }

        res.json(multiplayer.data);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Import campaign statistics
router.post("/import/:gamertag/campaign", async (req, res) => {
    try {
        const gamertag = req.params.gamertag.trim();
        const gamertagLower = gamertag.toLowerCase();

        console.log(`Importing campaign stats for ${gamertag}`);

        const campaignUrl =
            `https://wort.gg/api/stats/${encodeURIComponent(gamertag)}/campaign`;

        const response = await fetch(campaignUrl);

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Wort.gg campaign request failed with status ${response.status}`,
                url: campaignUrl
            });
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
            return res.status(502).json({
                error: "Unexpected campaign response from Wort.gg"
            });
        }

        // Find the existing player
        const player = await Player.findOne({
            gamertagLower
        });

        if (!player) {
            return res.status(404).json({
                error: "Player not found. Import multiplayer stats first."
            });
        }

        // Store or update campaign statistics
        const campaign = await Campaign.findOneAndUpdate(
            { playerId: player._id },
            {
                $set: {
                    data: data,
                    lastUpdated: new Date()
                }
            },
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Campaign statistics imported successfully",
            gamertag: player.gamertag,
            playerId: player._id,
            campaignId: campaign._id
        });

        console.log(`Successfully imported campaign stats for ${gamertag}`);

    } catch (error) {
        console.error("Campaign import error:", error);

        res.status(500).json({
            error: "Failed to import campaign statistics",
            details: error.message
        });
    }
});


// Retrieve campaign statistics
router.get("/players/:gamertag/campaign", async (req, res) => {
    try {
        const player = await Player.findOne({
            gamertagLower: req.params.gamertag.toLowerCase()
        });

        if (!player) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        const campaign = await Campaign.findOne({
            playerId: player._id
        });

        if (!campaign) {
            return res.status(404).json({
                error: "Campaign statistics not found"
            });
        }

        res.json(campaign.data);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


export default router;

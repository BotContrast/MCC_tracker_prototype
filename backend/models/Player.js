import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    gamertag: {
        type: String,
        required: true
    },

    gamertagLower: {
        type: String,
        required: true,
        unique: true
    },

    xuid: String,

    playerDetails: mongoose.Schema.Types.Mixed,

    ranks: [mongoose.Schema.Types.Mixed],

    xp: mongoose.Schema.Types.Mixed,

    minutesPlayed: Number,

    banned: Boolean,
    banReason: String,
    vip: Boolean,
    leaderboards: Boolean,

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Player", playerSchema, "players");

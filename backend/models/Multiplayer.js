import mongoose from "mongoose";

const multiplayerSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
        unique: true
    },

    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Multiplayer", multiplayerSchema, "multiplayers");

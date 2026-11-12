import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
        unique: true
    },

    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Campaign", campaignSchema, "campaigns");

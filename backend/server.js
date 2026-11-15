import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import playerRoutes from "./routes/playerRoutes.js";

// Load .env from backend directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api", playerRoutes);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "HaloTracker"
        });

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

startServer();


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// Check required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("MONGO_URI and JWT_SECRET are required in .env");
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to StudySnap API!"
    });
});

// Authentication routes
app.use("/api/auth", require("./routes/authRoutes"));

// Existing OCR and PDF routes - preserved
app.use("/api/study", require("./routes/studyRoutes"));

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);

    const statusCode =
        err.name === "MulterError" ||
        (err.message && err.message.includes("Only JPG"))
            ? 400
            : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong."
    });
});

// Start server only after MongoDB connects
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`StudySnap server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();

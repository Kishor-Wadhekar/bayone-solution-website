// ==========================================================
// BAYONE SOLUTIONS
// BROCHURE API SERVER
// ==========================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const brochureRouter = require("./routes/brochure");
const visitorsRouter = require("./routes/visitors");


// ==========================================================
// APP INITIALIZATION
// ==========================================================

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================================
// SECURITY
// ==========================================================

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);


// ==========================================================
// CORS
// ==========================================================

app.use(
    cors({
        origin: [
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ]
    })
);


// ==========================================================
// REQUEST BODY
// ==========================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================================
// RATE LIMITER
// ==========================================================

const brochureLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message:
            "Too many requests. Please try again later."
    }
});


// ==========================================================
// API HEALTH CHECK
// ==========================================================

app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "BayOne API is running.",
        environment: process.env.NODE_ENV
    });

});


// ==========================================================
// BROCHURE API
// ==========================================================

app.use(
    "/api/brochure-request",
    brochureLimiter,
    brochureRouter
);
app.use(
    "/api/visitors",
    visitorsRouter
);

// ==========================================================
// 404 HANDLER
// ==========================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });

});


// ==========================================================
// ERROR HANDLER
// ==========================================================

app.use((error, req, res, next) => {

    console.error(
        "Server Error:",
        error
    );

    res.status(500).json({
        success: false,
        message:
            "Something went wrong. Please try again later."
    });

});


// ==========================================================
// START SERVER
// ==========================================================

app.listen(PORT, () => {

    console.log("");
    console.log("================================================");
    console.log("        BAYONE SOLUTIONS - BROCHURE API");
    console.log("================================================");
    console.log(
        `Server running at: http://localhost:${PORT}`
    );
    console.log(
        `Environment: ${process.env.NODE_ENV}`
    );
    console.log("================================================");
    console.log("");

});
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const userRoutes = require("./app/user/route");
const checkRoutes = require("./app/check/route");
const loginRoutes = require("./app/login/route");
const turnitinRoutes = require("./app/turnitin/route");
const updateProfileInvoke = require("./app/update-profile/invoke");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    browser: browserStatus,
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/turnitin", turnitinRoutes);
app.use("/api", checkRoutes, loginRoutes);
updateProfileInvoke(app);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

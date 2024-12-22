const express = require("express");
const bodyParser = require("body-parser");
const postController = require("./controllers/postController");
const categoryController = require("./controllers/categoryController");
const imageController = require("./controllers/imageController");
const authController = require("./controllers/authController");
const connectToDB = require("./database/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

// Load environment variables from .env file
require("dotenv").config();

// Connect to MongoDB
connectToDB();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debugging statement to confirm the static path
console.log("Static file path:", express.static(path.join(__dirname, 'public')));

// Middleware to verify JWT (authentication)
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware/route
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Uncomment this if you want to secure routes with authentication
// app.use("/api", authenticateToken);

// Routes
app.use("/api", postController);         // Handle routes for posts
app.use("/api", categoryController);     // Handle routes for categories
app.use("/api", authController);         // Handle routes for authentication (login, register, etc.)
app.use("/api", imageController);        // Handle routes for image upload

// Test route to check if the server is working
app.get("/test", (req, res) => {
    res.status(200).json({ message: "API is working!" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

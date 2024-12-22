const User = require('../models/User');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey"; // Access JWT secret from .env

// Temporary Admin User (password is hashed)
const adminUser = {
    email: "admin@gmail.com",
    password: "$2a$12$Do142ZQGpCpcCrtkaeEP8.nPD3Jlb4Lw/ppmstlHOUvkWcg8y.49i", // "password" hashed
};

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        // Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send response with the token
        res.status(201).json({
            message: 'User registered successfully',
            authToken: token,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Admin Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if email matches the admin user

    const existingUser = await User.findOne({ $or: [{ email }] });

    if (email !== existingUser.email) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches the hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ authToken: token });
});

module.exports = router;

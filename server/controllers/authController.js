
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const COOKIE_NAME = "studysnap_token";
const TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

// Cookie settings
function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: TOKEN_AGE
    };
}

// Return safe user details
function safeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
}

// Generate JWT token
function createToken(userId) {
    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// ==============================
// SIGNUP
// ==============================
const signup = async (req, res) => {
    try {
        console.log("Signup body keys:", Object.keys(req.body || {}));

        console.log("Signup field types:", {
            name: typeof req.body?.name,
            email: typeof req.body?.email,
            password: typeof req.body?.password
        });

        const { name, email, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid details."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 60) {
            return res.status(400).json({
                success: false,
                message: "Name must contain 2 to 60 characters."
            });
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });
        }

        // Validate password
        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8 to 72 characters."
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            passwordHash
        });

        // Set authentication cookie
        res.cookie(
            COOKIE_NAME,
            createToken(user._id),
            cookieOptions()
        );

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: safeUser(user)
        });

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Signup failed."
        });
    }
};

// ==============================
// LOGIN
// ==============================
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.cookie(
            COOKIE_NAME,
            createToken(user._id),
            cookieOptions()
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: safeUser(user)
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed."
        });
    }
};

// ==============================
// LOGOUT
// ==============================
const logout = (req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
};

// ==============================
// GET CURRENT USER
// ==============================
const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: safeUser(req.user)
    });
};

// Export functions
module.exports = {
    signup,
    login,
    logout,
    getMe
};

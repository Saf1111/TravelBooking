
const express = require("express");
const session = require("express-session");
require("dotenv").config();

const db = require("./config/db");
const app = express();

const PORT = Number(process.env.PORT || 5000);

// Verify required configuration
const required = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "SESSION_SECRET",
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD"
];

const missing = required.filter(key => !process.env[key]);

if (missing.length) {
    console.error("Missing environment variables:", missing);
    process.exit(1);
}

// Middleware
app.use(express.json({ limit: "16kb" }));

app.use(session({
    name: "travelbooking.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Temporary: enable HTTPS before production
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    }
}));

// Admin authentication middleware
function requireAdmin(req, res, next) {
    if (!req.session || !req.session.isAdmin) {
        return res.status(401).json({
            success: false,
            message: "Admin login required"
        });
    }

    next();
}

// ===============================
// BOOKING API
// ===============================

app.post("/api/booking", (req, res) => {
    const {
        name,
        email,
        phone,
        destination,
        travelDate
    } = req.body || {};

    const fields = [name, email, phone, destination, travelDate];

    if (fields.some(value =>
        typeof value !== "string" || !value.trim()
    )) {
        return res.status(400).json({
            success: false,
            message: "All booking fields are required"
        });
    }

    if (
        name.length > 100 ||
        email.length > 255 ||
        phone.length > 20 ||
        destination.length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(travelDate)
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid booking details"
        });
    }

    const date = new Date(travelDate + "T00:00:00Z");

    if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== travelDate
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid travel date"
        });
    }

    const sql = `
        INSERT INTO bookings
        (name, email, phone, destination, travel_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name.trim(),
            email.trim(),
            phone.trim(),
            destination.trim(),
            travelDate
        ],
        (err, result) => {
            if (err) {
                console.error("Booking database error:", err.code);

                return res.status(500).json({
                    success: false,
                    message: "Booking could not be saved"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Booking saved successfully",
                bookingId: result.insertId
            });
        }
    );
});

// ===============================
// GET BOOKINGS - ADMIN ONLY
// ===============================

app.get("/api/bookings", requireAdmin, (req, res) => {
    db.query(
        "SELECT * FROM bookings ORDER BY id DESC",
        (err, results) => {
            if (err) {
                console.error("Fetch bookings error:", err.code);

                return res.status(500).json({
                    success: false,
                    message: "Could not fetch bookings"
                });
            }

            return res.json(results);
        }
    );
});

// ===============================
// ADMIN LOGIN
// ===============================

app.post("/api/login", (req, res) => {
    const { username, password } = req.body || {};

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        username !== process.env.ADMIN_USERNAME ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }

    req.session.regenerate(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Login failed"
            });
        }

        req.session.isAdmin = true;

        req.session.save(err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Login failed"
                });
            }

            return res.json({
                success: true,
                message: "Login successful"
            });
        });
    });
});

// ===============================
// ADMIN LOGOUT
// ===============================

app.post("/api/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }

        res.clearCookie("travelbooking.sid");

        return res.json({
            success: true,
            message: "Logged out successfully"
        });
    });
});

// ===============================
// API STATUS
// ===============================

app.get("/api", (req, res) => {
    res.json({
        status: "TravelGo Backend Running"
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});


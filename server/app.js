const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}));


// ===============================
// BOOKING API
// ===============================

app.post("/api/booking", (req, res) => {

    const { name, email, phone, destination, travelDate } = req.body;

    console.log("========== NEW BOOKING ==========");
    console.log(req.body);

    const sql = `
        INSERT INTO bookings
        (name, email, phone, destination, travel_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, destination, travelDate],
        (err, result) => {

            if (err) {
                console.error("❌ Database Insert Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Booking could not be saved"
                });
            }

            console.log("✅ Booking saved to MySQL");
            console.log("Booking ID:", result.insertId);

            res.json({
                success: true,
                message: "Booking Saved Successfully!",
                bookingId: result.insertId
            });
        }
    );
});


// ===============================
// GET ALL BOOKINGS
// ===============================

app.get("/api/bookings", (req, res) => {

    db.query("SELECT * FROM bookings", (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Could not fetch bookings"
            });
        }

        res.json(results);
    });
});


// ===============================
// ADMIN LOGIN
// ===============================

app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {

        req.session.isAdmin = true;

        return res.json({
            success: true,
            message: "Login successful"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password"
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

app.listen(process.env.PORT, () => {

    console.log(`Server running on port ${process.env.PORT}`);

});
app.post("/api/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Logout failed"
            });
        }

        res.json({
            success: true,
            message: "Logged out successfully"
        });

    });

});

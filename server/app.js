const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API Route
app.post("/api/booking", (req, res) => {

    console.log("========== NEW BOOKING ==========");

    console.log(req.body);

    res.json({
        success: true,
        message: "Booking Received Successfully!"
    });

});

// Health Check
app.get("/api", (req, res) => {
    res.json({
        status: "TravelGo Backend Running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🌍 Welcome to TravelGo Backend!");
});

app.post("/booking", (req, res) => {

    console.log("========== NEW BOOKING ==========");

    console.log(req.body);

    res.json({
        success: true,
        message: "Booking Received Successfully!"
    });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
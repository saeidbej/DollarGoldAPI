const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Dollar & Gold API Running"
  });
});

app.get("/prices", (req, res) => {
  res.json({
    dollar_today: 175000,
    dollar_tomorrow: 176000,
    ounce_gold: 4328
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const app = express();
app.use(cors());

// 🌐 API
app.get("/", (req, res) => {
  res.json({ status: "online" });
});

app.get("/prices", (req, res) => {
  res.json({
    dollar_today: 175000,
    dollar_tomorrow: 176500,
    ounce_gold: 4328
  });
});

// 🤖 Telegram Bot
const TOKEN = process.env.BOT_TOKEN || "YOUR_TOKEN";
const bot = new TelegramBot(TOKEN, { polling: true });

const API_URL = "https://dollargoldapi.onrender.com/prices";

// start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 سلام

/dollar - قیمت دلار
/mothaneh - مظنه طلا`
  );
});

// دلار
bot.onText(/\/dollar/, async (msg) => {
  const res = await axios.get(API_URL);
  bot.sendMessage(msg.chat.id, `💵 دلار: ${res.data.dollar_today}`);
});

// مظنه
bot.onText(/\/mothaneh/, async (msg) => {
  const res = await axios.get(API_URL);

  const dollar = res.data.dollar_today;
  const ounce = res.data.ounce_gold;

  const mothaneh = (dollar * ounce) / 9.5742;

  bot.sendMessage(msg.chat.id,
`📊 مظنه:
${Math.floor(mothaneh)} تومان`
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

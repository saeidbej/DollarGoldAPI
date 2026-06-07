const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const app = express();
app.use(cors());

// ---------------- API TEST ----------------
app.get("/", (req, res) => {
  res.json({ status: "online" });
});

// ---------------- TELEGRAM BOT ----------------
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

// ---------------- FUNCTIONS ----------------

// دلار واقعی
async function getDollar() {
  const res = await axios.get("https://open.er-api.com/v6/latest/USD");
  return res.data.rates.IRR; // ریال
}

// انس جهانی طلا
async function getGoldOunce() {
  const res = await axios.get("https://api.metals.live/v1/spot/gold");
  return res.data[0].price;
}

// ---------------- COMMANDS ----------------

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 سلام

💵 /dollar - دلار واقعی
🪙 /gold - انس جهانی
📊 /mothaneh - مظنه واقعی`
  );
});

// دلار
bot.onText(/\/dollar/, async (msg) => {
  try {
    const dollar = await getDollar();
    bot.sendMessage(msg.chat.id, `💵 دلار واقعی:\n${Math.floor(dollar)} ریال`);
  } catch {
    bot.sendMessage(msg.chat.id, "❌ خطا در گرفتن دلار");
  }
});

// انس طلا
bot.onText(/\/gold/, async (msg) => {
  try {
    const gold = await getGoldOunce();
    bot.sendMessage(msg.chat.id, `🪙 انس جهانی:\n$${gold}`);
  } catch {
    bot.sendMessage(msg.chat.id, "❌ خطا در انس طلا");
  }
});

// مظنه
bot.onText(/\/mothaneh/, async (msg) => {
  try {
    const dollar = await getDollar();
    const gold = await getGoldOunce();

    // فرمول مظنه
    const mothaneh = (dollar * gold) / 9.5742;

    bot.sendMessage(msg.chat.id,
`📊 مظنه واقعی:
${Math.floor(mothaneh)} تومان`
    );
  } catch {
    bot.sendMessage(msg.chat.id, "❌ خطا در محاسبه مظنه");
  }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const app = express();
app.use(cors());

// ---------------- CACHE ----------------
let cache = {
  dollar_today: 0,
  dollar_tomorrow: 0,
  gold_ounce: 1965 // انس ثابت برای جلوگیری از خطا
};

// ---------------- API TEST ----------------
app.get("/", (req, res) => {
  res.json({ status: "online" });
});

app.get("/prices", (req, res) => {
  res.json(cache);
});

// ---------------- TELEGRAM BOT ----------------
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

// ---------------- FETCH FUNCTIONS ----------------

// دلار واقعی
async function getDollar() {
  try {
    const res = await axios.get("https://open.er-api.com/v6/latest/USD");
    return res.data.rates.IRR;
  } catch (err) {
    console.log("Dollar fetch error:", err.message);
    return cache.dollar_today; // اگر خطا شد مقدار قبلی را بده
  }
}

// ---------------- UPDATE CACHE EVERY 10 SEC ----------------
async function updatePrices() {
  try {
    const dollar = await getDollar();

    // دلار فردایی تخمینی (0.5٪ افزایش)
    const tomorrow = dollar * 1.005;

    cache.dollar_today = Math.floor(dollar);
    cache.dollar_tomorrow = Math.floor(tomorrow);

    console.log("Prices updated:", cache);
  } catch (err) {
    console.log("Update error:", err.message);
  }
}

// هر 10 ثانیه آپدیت
setInterval(updatePrices, 10000);
updatePrices();

// ---------------- BOT COMMANDS ----------------

// start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 سلام

💵 /dollar - دلار امروز و فردا
🪙 /gold - انس جهانی ثابت
📊 /mothaneh - مظنه لحظه‌ای`
  );
});

// دلار
bot.onText(/\/dollar/, (msg) => {
  bot.sendMessage(msg.chat.id,
`💵 دلار امروز: ${cache.dollar_today}
📅 دلار فردا: ${cache.dollar_tomorrow}`
  );
});

// انس جهانی ثابت
bot.onText(/\/gold/, (msg) => {
  bot.sendMessage(msg.chat.id,
`🪙 انس جهانی: $${cache.gold_ounce}`
  );
});

// مظنه
bot.onText(/\/mothaneh/, (msg) => {
  const dollar = cache.dollar_today;
  const gold = cache.gold_ounce;

  if (!dollar || !gold) {
    return bot.sendMessage(msg.chat.id, "❌ هنوز داده‌ها آماده نشده");
  }

  const mothaneh = (dollar * gold) / 9.5742;

  bot.sendMessage(msg.chat.id,
`📊 مظنه لحظه‌ای:
${Math.floor(mothaneh)} تومان`
  );
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));

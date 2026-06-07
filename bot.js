const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// 🔐 توکن ربات تو
const TOKEN = "8862154994:AAEZ-AkpbJDqZgaAziUo_4gJgCImmUSlRuI";

// 🌐 آدرس API روی Render
const API_URL = "https://dollargoldapi.onrender.com/prices";

const bot = new TelegramBot(TOKEN, { polling: true });

// شروع ربات
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id,
`👋 سلام!

دستورها:
💵 /dollar - قیمت دلار
📊 /mothaneh - محاسبه مظنه طلا`
  );
});

// دلار
bot.onText(/\/dollar/, async (msg) => {
  try {
    const res = await axios.get(API_URL);
    const dollar = res.data.dollar_today;

    bot.sendMessage(msg.chat.id,
`💵 قیمت دلار امروز:
${dollar} ریال`
    );
  } catch (err) {
    bot.sendMessage(msg.chat.id, "❌ خطا در دریافت قیمت دلار");
  }
});

// مظنه
bot.onText(/\/mothaneh/, async (msg) => {
  try {
    const res = await axios.get(API_URL);

    const dollar = res.data.dollar_today;
    const ounce = res.data.ounce_gold;

    // 📊 فرمول مظنه
    const mothaneh = (dollar * ounce) / 9.5742;

    bot.sendMessage(msg.chat.id,
`📊 مظنه طلا:
${Math.floor(mothaneh)} تومان`
    );
  } catch (err) {
    bot.sendMessage(msg.chat.id, "❌ خطا در محاسبه مظنه");
  }
});

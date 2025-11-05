import TelegramBot from "node-telegram-bot-api";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text?.trim();

  if (!userMessage) return;

  try {
    await bot.sendChatAction(chatId, "typing");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant named ZenBot." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    await bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error("Error:", error.message);
    await bot.sendMessage(chatId, "⚠️ Error processing your message.");
  }
});

import { Telegraf } from "telegraf";
import dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.TOKEN || '')

bot.start(ctx => {
	ctx.reply('Hola ' + ctx.from.first_name)
})

// Launch bot
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
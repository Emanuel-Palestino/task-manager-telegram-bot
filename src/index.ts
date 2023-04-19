// Config environment
import dotenv from 'dotenv'
dotenv.config()

import bot from './bot'

// Launch bot
bot.launch()
console.log('Bot running')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
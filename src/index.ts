// Config environment
import dotenv from 'dotenv'
dotenv.config()

import bot from './bot'

// Load bot features
import './features/testing'
import './features/create_task'
import './features/createArea'

// Launch bot
bot.launch()
console.log('Bot running')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
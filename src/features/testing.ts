import bot from '../bot'
import { createArea, getAreas, getTasks, testGetInfo } from '../firebase/api'
import {TeamGroup} from '../models/models'
bot.command('test', async ctx => {
	const response = await getTasks(String(ctx.chat.id))
	return ctx.reply(response.map(a => a.title).join('\n'))
})

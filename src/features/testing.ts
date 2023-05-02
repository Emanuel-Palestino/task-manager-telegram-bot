import bot from '../bot'
import { addMemberToArea, createArea, getAreas, getTasks, testGetInfo } from '../firebase/api'
import { TeamGroup } from '../models/models'
import { Area } from '../models/models'
bot.command('test', async ctx => {
	const response = await addMemberToArea(String(ctx.chat.id), { id: String(ctx.from.id), name: 'Yo', username: '' }, 'sIAo1wfvK6vt4qB5GsFf')
	return await ctx.reply('listo')
})

import bot from '../bot'
import { addMemberToArea, createArea, getAreaMembers, getAreas, getTasks, testGetInfo } from '../firebase/api'
import { TeamGroup } from '../models/models'
import { Area } from '../models/models'
bot.command('test', async ctx => {
	const response = await getAreaMembers(String(ctx.chat.id), 'sIAo1wfvK6vt4qB5GsFf')
	console.log(response)
	return await ctx.reply('listo')
})

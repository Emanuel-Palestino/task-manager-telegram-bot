import bot from '../bot'
import { getWorkSpacesMembers, getTasks, testGetInfo } from '../firebase/api'
bot.command('test', async ctx => {
	const response = await getWorkSpacesMembers(String(ctx.chat.id), 'sIAo2wfvK6vt4qB5GsFf')
	console.log(response)
	return await ctx.reply('listo')
})

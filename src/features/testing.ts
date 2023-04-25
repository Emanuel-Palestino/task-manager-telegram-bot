import bot from '../bot'
import { createArea, testGetInfo } from '../firebase/api'

bot.command('test', async ctx => {
	const response = await createArea(String(ctx.chat.id), { name: 'Otro' })
	if (!response)
		return console.log('No existe el grupo')
	await testGetInfo(String(ctx.chat.id))
	return console.log('agregado')
})
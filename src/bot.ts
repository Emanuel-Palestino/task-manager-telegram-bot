import { Markup, Telegraf } from 'telegraf'
import { initialMessage, teamAddedMessage } from './constants/messages'
import { createArea, createTask, testGetInfo } from './firebase/api'


const bot = new Telegraf(process.env.TOKEN || '')

bot.start(async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers > 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.replyWithHTML(initialMessage)
})

bot.command('myteam', async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers == 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.replyWithHTML(teamAddedMessage,
		Markup.inlineKeyboard([
			Markup.button.callback('Join the team', 'join')
		])
	).then(message => {
		bot.telegram.pinChatMessage(ctx.chat.id, message.message_id)
	})
})

bot.action('join', ctx => {
	return ctx.answerCbQuery('Welcome to the team!')
})

bot.command('members', async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers == 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.reply('Members:\n')
})

bot.command('test', async ctx => {
	const response = await createArea(String(ctx.chat.id), { name: 'Desarrollo' })
	if (!response)
		return console.log('No existe el grupo')
	await testGetInfo(String(ctx.chat.id))
	return console.log('agregado')
})


export default bot
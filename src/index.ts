import { Markup, Telegraf } from "telegraf"
import dotenv from 'dotenv'

dotenv.config()

const initialMessage = `
Hello I will help you to managing tasks in your team.
Firts, please added me to your team group. Then, use the command <b>/myteam</b> to register your team group.
`

const teamAddedMessage = `
The team has been added successfully.\n
To start, please click the follow button to register in members list. This action is required just once.
`

let members: any[] = []

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
	members.push({
		id: ctx.from?.id,
		name: ctx.from?.first_name
	})
	console.log(members)
	return ctx.answerCbQuery('Welcome to the team!')
})

bot.command('/members', async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers == 2)
		return ctx.deleteMessage(ctx.message.message_id)
	
	return ctx.reply('Members:\n' + members.map(member => member.name).join('\n'))
})

// Launch bot
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
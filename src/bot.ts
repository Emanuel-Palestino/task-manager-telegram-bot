import { Markup, Scenes, Telegraf, session } from 'telegraf'
import { initialMessage, teamAddedMessage } from './constants/messages'
import { addMember, registerTelegramGroup } from './firebase/api'
import { Person } from './models/models'


// Create bot
const bot = new Telegraf<Scenes.WizardContext>(process.env.TOKEN || '')


// Start command, only available in a private chat
bot.start(async ctx => {
	// Delete message if not in a private chat
	if (ctx.chat.type !== 'private')
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.replyWithHTML(initialMessage)
})

// "Register team group" command, only available in a group
bot.command('register_workteam', async ctx => {
	const { type, id } = ctx.chat

	// Delete message if in a private chat
	if (type === 'private')
		return ctx.deleteMessage(ctx.message.message_id)

	// Register team
	const response = await registerTelegramGroup(String(id))

	// Registration failed
	if (!response)
		return await ctx.reply('Registration failed or workteam already registered.')

	// Send successfully message
	await ctx.reply(teamAddedMessage[0])
	const message = await ctx.replyWithHTML(teamAddedMessage[1],
		Markup.inlineKeyboard([
			Markup.button.callback('Join the team', 'join_team')
		])
	)

	// Pin message
	return await ctx.pinChatMessage(message.message_id)
})

bot.action('join_team', async ctx => {
	// No user from 
	if (!ctx.from)
		return

	// New member data
	const { id, first_name, username } = ctx.from
	const newPerson: Person = {
		id: String(id),
		name: first_name,
		username: username || ''
	}

	// Add member to work team data base
	const response = await addMember(String(ctx.chat!.id), newPerson)

	// Addition failed
	if (!response)
		ctx.answerCbQuery('Addition failed or group is not registered.')

	return ctx.answerCbQuery('Welcome to the team!')
})


bot.use(session())

export default bot
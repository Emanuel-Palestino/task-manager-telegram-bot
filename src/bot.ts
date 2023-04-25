import { Markup, Telegraf } from 'telegraf'
import { initialMessage, teamAddedMessage } from './constants/messages'

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

bot.command('crear_grupo', async (ctx) => {
	const chatId: number = ctx.chat.id;
	const nombreGrupo: string = ctx.message.text.split(' ')[1];
	if (!nombreGrupo) {
		return ctx.reply('Debes especificar un nombre para el grupo.');
	}
	if (false) {
		return ctx.reply(`Ya existe un grupo con el nombre ${nombreGrupo}.`);
	}
	// Create new group
	return ctx.reply(`El grupo ${nombreGrupo} ha sido creado correctamente.`);
});



export default bot
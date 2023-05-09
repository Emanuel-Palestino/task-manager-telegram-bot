import { Markup } from "telegraf";
import bot from '../bot'
import { getAreas, getAreaMembers } from '../firebase/api'

let idTelegramGroup : string

bot.command('list_areas', async ctx => {
	idTelegramGroup = String(ctx.chat.id)
	const response = await getAreas(idTelegramGroup)
	
	return ctx.reply("Areas:", Markup.inlineKeyboard(response.map(a => Markup.button.callback(a.name, "/list_members " + a.name)), {
		wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
	}))
})

bot.action(/\/list_members .+/, async ctx => {
	const area = ctx.match[0].replace("/list_members ", "")
	const response = await getAreaMembers(idTelegramGroup,String(area))
	const members = response.map(a => `${a.name}(@${a.username})`).join('\n')
	return ctx.reply(`Members of the "${area}" area:\n\n${members}`)
});
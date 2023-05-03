import { Markup } from "telegraf";
import bot from '../bot'
import { createTask, getTasks, getAreas, registerTelegramGroup } from '../firebase/api'

bot.command('list_areas', async ctx => {
    const response = await getAreas(String(ctx.chat.id))
    console.log(response)
    return ctx.reply("Areas", Markup.inlineKeyboard(response.map(a => Markup.button.callback(a.name, "/list_member "+a.name)), {
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
    }))
})

bot.action(/\/list_member ([a-zA-Z\xA1-\xFF]+)/, ctx => {
    const area = ctx.match[0].split(" ")[1]
    return ctx.answerCbQuery(`Escojiste el área: ${area} `);
});
import { Message } from "telegraf/typings/core/types/typegram";
import { Markup } from "telegraf";
import bot from '../bot'
import { getAreas, getAreaMembers } from '../firebase/api'

export async function list_areas(ctx: any): Promise<any> {

    //Selección Individual
    if (ctx.scene.session.bandMember == undefined) {

        ctx.scene.session.bandMember = "Select_areas";
        const list_areas = await getAreas(ctx.chat?.id);
        let listAreas: String = ''
        for (let i = 0; i < list_areas.length; i++)
            listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n"

        await ctx.reply(listAreas + "\n" + "Write the number of the team area")

        return ctx.wizard.selectStep(ctx.wizard.cursor);

    }

    //Selección Areas

    else if (ctx.scene.session.bandMember == "Select_areas") {
        const list_areas = await getAreas(ctx.chat?.id);
        const index = Number((ctx.message as Message.TextMessage).text)

        //Si la opción de la area está dentro del rango
        if ((index - 1) < list_areas.length) {
            let show_members = ''
            ctx.scene.session.idArea = String(list_areas[index - 1].id)
            ctx.wizard.next();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
        else
            await ctx.reply("The area does not exist, please rewrite the number")

        return ctx.wizard.selectStep(ctx.wizard.cursor)
    }
}


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

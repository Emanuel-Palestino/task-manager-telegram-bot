import { Message } from "telegraf/typings/core/types/typegram";
import { getAreaMembers, getAreas } from "../firebase/api";

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
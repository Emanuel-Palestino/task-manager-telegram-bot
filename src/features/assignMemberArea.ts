import { Markup, Scenes, Context } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { Message } from "telegraf/typings/core/types/typegram";
import { customWizardContext } from "../models/customWizardContext";
import bot from "../bot";
import { getAreaMembers, getAreas } from "../firebase/api";

const areaAss_wizard = new Scenes.WizardScene<customWizardContext>("assign_area",
    async (ctx) =>{
        const list_areas = await getAreas(String(ctx.chat?.id));
        let listAreas: String = ''
        for (let i = 0; i < list_areas.length; i++)
            listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n"

        await ctx.reply(listAreas + "\n" + "Write the number of the team area")
    },

    async (ctx) =>{
        const list_areas = await getAreas(String(ctx.chat?.id));
        const index = Number((ctx.message as Message.TextMessage).text)
        
        //Si la opción de la area está dentro del rango
        if((index-1)<list_areas.length){
            let show_members = ''
            ctx.scene.session.idAuxiliar = String(list_areas[index-1].id)
            const list_area_members = await getAreaMembers(String(ctx.chat?.id),ctx.scene.session.idAuxiliar)

            //Si existen miembros del área
            if(list_area_members.length>0){
                for(let i = 0; i<= list_area_members.length; i++)
                show_members += (list_area_members[i].name + " " + list_area_members[i].username + '\n')
                show_members += 'Press\n1.-Add all members\n2.- Add one by one'
                ctx.scene.session.bandMember = "Select_option_assign"
            }
            else
                await ctx.reply("The area members is empty.\nWrite 'Individual' or 'Areas' for the selection of members.")
        }
    }
)  

const stage = new Scenes.Stage<customWizardContext>([areaAss_wizard]);
bot.use(stage.middleware());

bot.command("assign_area", async (ctx) => {
  return await ctx.scene.enter("assign_area");
});
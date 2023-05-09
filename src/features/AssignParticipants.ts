import { Markup, Context, Scenes } from "telegraf"
import { Message } from "telegraf/typings/core/types/typegram"
import { Area, Person } from "../models/models"
import { getAreas, getAreaMembers } from "../firebase/api";

function members_individual() {
    const person1: Person = { name: 'Juan', username: '@Juan22' };
    const person2: Person = { name: 'María', username: '@Maria33' };

    const members: { [key: string]: Person } = {};
    members['person1'] = person1;
    members['person2'] = person2;

    return members
}

function info_user(message: any) {
    const entities = (message as Message.TextMessage).entities
    if (entities)
        return (entities[0] as any).user
}

function search_member(usernameToFind: String, members: any) {
    for (const key in members) {
        if (members.hasOwnProperty(key)) {
            const person = members[key];
            if (person.username == usernameToFind)
                return key
        }
    }
    return undefined
}

function findIdByName(arr:Area[], name: string): string | undefined {
    const obj = arr.find(item => item.name === name);
    return obj ? obj.id : undefined;
}

export async function assign_members(ctx: any): Promise<any> {
    if ((ctx.message as Message.TextMessage).text == 'Stop' || (ctx.message as Message.TextMessage).text == 'stop') {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx)
    }

    else if ((ctx.message as Message.TextMessage).text == 'Individual') {
        ctx.scene.session.bandMember = 'Individual'
        await ctx.reply("Type the members' usernames (using @), one by one. To finish, type Stop.")
        return ctx.wizard.selectStep(ctx.wizard.cursor)
    }

    else if ((ctx.message as Message.TextMessage).text == 'Areas') {
      /*ctx.scene.session.bandMember = 'Select_areas'
        //Here list the teams.
        const list_areas = await getAreas(ctx.chat?.id)

        for (let i=0;i<list_areas.length;i++)
            await ctx.reply(''+list_areas[i].name)

        await ctx.reply('Write the name of the team area')
        return ctx.wizard.selectStep(ctx.wizard.cursor)*/
      const idTelegramGroup = String(ctx.chat.id);
      const response = await getAreas(idTelegramGroup);

      return ctx.reply(
        "Areas:",
        Markup.inlineKeyboard(
          response.map((a) =>
            Markup.button.callback(a.name, "/list_members " + a.name)
          ),
          {
            wrap: (btn, index, currentRow) =>
              currentRow.length >= (index + 1) / 2,
          }
        )
      );
    }

    //Here is for the members individual
    else if (ctx.scene.session.bandMember == 'Individual' || ctx.scene.session.bandMember == 'AInd') {
        const username = (ctx.message as Message.TextMessage).text
        let members: any

        if (ctx.scene.session.bandMember == 'Individual')
            members = members_individual()

        if (username.startsWith('@')) {

            const keyMember = search_member(username, members)

            //Si no está
            if (!keyMember)
                await ctx.reply('undefined user, type it again')
            else
                ctx.scene.session.members[keyMember] = members[keyMember]
        }

        return ctx.wizard.selectStep(ctx.wizard.cursor)
    }

    else {
        await ctx.reply("Incorrect option, please write the correct message")
        return ctx.wizard.selectStep(ctx.wizard.cursor)
    }
}
import { Message } from "telegraf/typings/core/types/typegram";
import { Area, Person } from "../models/models";
import { getAreas, getAreaMembers, getGroupMembers } from "../firebase/api";

function search_member(usernameToFind: String, members: any) {
    for (const key in members) {
        if (members.hasOwnProperty(key)) {
            const person = members[key];
            if (person.username == usernameToFind) return key;
        }
    }
    return undefined;
}

function findIdByName(arr: Area[], name: string): string | undefined {
    const obj = arr.find((item) => item.name === name);
    return obj ? obj.id : undefined;
}

export async function assign_members(ctx: any): Promise<any> {
    let areaMembersG: any;
    if ((ctx.message as Message.TextMessage).text == "Stop" || (ctx.message as Message.TextMessage).text == "stop") {
        ctx.wizard.next();
        return ctx.wizard.steps[ctx.wizard.cursor](ctx);

    } else if ((ctx.message as Message.TextMessage).text == "Individual") {
        console.log(ctx.chat?.id);
        ctx.scene.session.bandMember = "Individual";
        await ctx.reply(
            "Type the members' usernames (using @), one by one. To finish, type Stop."
        );
        return ctx.wizard.selectStep(ctx.wizard.cursor);

    } else if ((ctx.message as Message.TextMessage).text == "Areas") {
        ctx.scene.session.bandMember = "Select_areas";
        //Here list the teams.
        const list_areas = await getAreas(ctx.chat?.id);

        for (let i = 0; i < list_areas.length; i++)
            await ctx.reply("" + list_areas[i].name);

        await ctx.reply("Write the name of the team area");
        return ctx.wizard.selectStep(ctx.wizard.cursor);

    } else if (ctx.scene.session.bandMember == "Select_areas") {
        console.log(ctx.scene.session.bandMember)
        const list_areas = await getAreas(ctx.chat?.id);
        const areasMembers = findIdByName(list_areas,(ctx.message as Message.TextMessage).text);
        areaMembersG = getAreaMembers(ctx.chat?.id,String(areasMembers))
        
        if (areasMembers) {
            
            for (let i=0; i<areaMembersG.length;i++)
                await ctx.reply(''+areaMembersG[i].name+' '+ areaMembersG[i].username)
            ctx.reply("Enter the number you are interested in: \n1. Get all members.\n2. Add one by one");
            ctx.scene.session.bandMember = "Select_number";
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        } else {
            ctx.reply("The area does not exist type again");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }

    } else if (ctx.scene.session.bandMember == "Select_number") {
        if ((ctx.message as Message.TextMessage).text == "1") {
            if (areaMembersG?.length > 1) ctx.scene.session.members = areaMembersG;
            else {
                await ctx.reply("Area members empty");
                ctx.wizard.next();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
        } else ctx.scene.session.bandMember == "2";
    }

    //Here is for the members individual
    else if (
        ctx.scene.session.bandMember == "Individual" ||
        ctx.scene.session.bandMember == "2"
    ) {
        const username = (ctx.message as Message.TextMessage).text;
        let members: any;

        if (ctx.scene.session.bandMember == "Individual")
            members = await getGroupMembers(String(ctx.chat?.id));

        if (username.startsWith("@")) {
            const keyMember = search_member(username, members);

            //Si no está
            if (!keyMember) await ctx.reply("undefined user, type it again");
            else ctx.scene.session.members[keyMember] = members[keyMember];
        }

        return ctx.wizard.selectStep(ctx.wizard.cursor);
    } else {
        await ctx.reply("Incorrect option, please write the correct message");
        return ctx.wizard.selectStep(ctx.wizard.cursor);
    }
}

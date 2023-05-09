"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign_members = void 0;
const telegraf_1 = require("telegraf");
const api_1 = require("../firebase/api");
function members_individual() {
    const person1 = { name: 'Juan', username: '@Juan22' };
    const person2 = { name: 'María', username: '@Maria33' };
    const members = {};
    members['person1'] = person1;
    members['person2'] = person2;
    return members;
}
function info_user(message) {
    const entities = message.entities;
    if (entities)
        return entities[0].user;
}
function search_member(usernameToFind, members) {
    for (const key in members) {
        if (members.hasOwnProperty(key)) {
            const person = members[key];
            if (person.username == usernameToFind)
                return key;
        }
    }
    return undefined;
}
function findIdByName(arr, name) {
    const obj = arr.find(item => item.name === name);
    return obj ? obj.id : undefined;
}
function assign_members(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.message.text == 'Stop' || ctx.message.text == 'stop') {
            ctx.wizard.next();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
        else if (ctx.message.text == 'Individual') {
            ctx.scene.session.bandMember = 'Individual';
            yield ctx.reply("Type the members' usernames (using @), one by one. To finish, type Stop.");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        else if (ctx.message.text == 'Areas') {
            /*ctx.scene.session.bandMember = 'Select_areas'
              //Here list the teams.
              const list_areas = await getAreas(ctx.chat?.id)
      
              for (let i=0;i<list_areas.length;i++)
                  await ctx.reply(''+list_areas[i].name)
      
              await ctx.reply('Write the name of the team area')
              return ctx.wizard.selectStep(ctx.wizard.cursor)*/
            const idTelegramGroup = String(ctx.chat.id);
            const response = yield (0, api_1.getAreas)(idTelegramGroup);
            return ctx.reply("Areas:", telegraf_1.Markup.inlineKeyboard(response.map((a) => telegraf_1.Markup.button.callback(a.name, "/list_members " + a.name)), {
                wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
            }));
        }
        //Here is for the members individual
        else if (ctx.scene.session.bandMember == 'Individual' || ctx.scene.session.bandMember == 'AInd') {
            const username = ctx.message.text;
            let members;
            if (ctx.scene.session.bandMember == 'Individual')
                members = members_individual();
            if (username.startsWith('@')) {
                const keyMember = search_member(username, members);
                //Si no está
                if (!keyMember)
                    yield ctx.reply('undefined user, type it again');
                else
                    ctx.scene.session.members[keyMember] = members[keyMember];
            }
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        else {
            yield ctx.reply("Incorrect option, please write the correct message");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
    });
}
exports.assign_members = assign_members;

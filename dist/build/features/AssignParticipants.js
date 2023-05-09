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
    var _a, _b, _c;
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
            ctx.scene.session.bandMember = 'Select_areas';
            //Here list the teams.
            const list_areas = yield (0, api_1.getAreas)((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id);
            for (let i = 0; i < list_areas.length; i++)
                yield ctx.reply('' + list_areas[i].name);
            yield ctx.reply('Write the name of the team area');
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        else if (ctx.scene.session.bandMember == 'Select_area') {
            //Show the members
            const list_areas = yield (0, api_1.getAreas)((_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id);
            const idArea = findIdByName(list_areas, ctx.message.text);
            if (idArea) {
                const areaMembers = yield (0, api_1.getAreaMembers)((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id, idArea);
                for (let i = 0; i < areaMembers.length; i++)
                    yield ctx.reply('' + areaMembers[i].name + ' ' + areaMembers[i].username);
            }
            else {
                yield ctx.reply('Write the correct name of the team area');
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
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

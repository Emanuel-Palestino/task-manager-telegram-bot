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
    const obj = arr.find((item) => item.name === name);
    return obj ? obj.id : undefined;
}
function assign_members(ctx) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let areaMembersG;
        if (ctx.message.text == "Stop" ||
            ctx.message.text == "stop") {
            ctx.wizard.next();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
        else if (ctx.message.text == "Individual") {
            console.log((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id);
            ctx.scene.session.bandMember = "Individual";
            yield ctx.reply("Type the members' usernames (using @), one by one. To finish, type Stop.");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        else if (ctx.message.text == "Areas") {
            ctx.scene.session.bandMember = "Select_areas";
            //Here list the teams.
            const list_areas = yield (0, api_1.getAreas)((_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id);
            for (let i = 0; i < list_areas.length; i++)
                yield ctx.reply("" + list_areas[i].name);
            yield ctx.reply("Write the name of the team area");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        else if (ctx.scene.session.bandMember == "Select_areas") {
            console.log(ctx.scene.session.bandMember);
            const list_areas = yield (0, api_1.getAreas)((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id);
            const areasMembers = findIdByName(list_areas, ctx.message.text);
            areaMembersG = (0, api_1.getAreaMembers)((_d = ctx.chat) === null || _d === void 0 ? void 0 : _d.id, String(areasMembers));
            if (areasMembers) {
                for (let i = 0; i < areaMembersG.length; i++)
                    yield ctx.reply('' + areaMembersG[i].name + ' ' + areaMembersG[i].username);
                ctx.reply("Enter the number you are interested in: \n1. Get all members.\n2. Add one by one");
                ctx.scene.session.bandMember = "Select_number";
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
            else {
                ctx.reply("The area does not exist type again");
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
        }
        else if (ctx.scene.session.bandMember == "Select_number") {
            if (ctx.message.text == "1") {
                if ((areaMembersG === null || areaMembersG === void 0 ? void 0 : areaMembersG.length) > 1)
                    ctx.scene.session.members = areaMembersG;
                else {
                    yield ctx.reply("Area members empty");
                    ctx.wizard.next();
                    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
                }
            }
            else
                ctx.scene.session.bandMember == "2";
        }
        //Here is for the members individual
        else if (ctx.scene.session.bandMember == "Individual" ||
            ctx.scene.session.bandMember == "2") {
            const username = ctx.message.text;
            let members;
            if (ctx.scene.session.bandMember == "Individual")
                members = yield (0, api_1.getGroupMembers)(String((_e = ctx.chat) === null || _e === void 0 ? void 0 : _e.id));
            if (username.startsWith("@")) {
                const keyMember = search_member(username, members);
                //Si no está
                if (!keyMember)
                    yield ctx.reply("undefined user, type it again");
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

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
exports.assign_members = exports.list_areas_mebers = void 0;
const api_1 = require("../firebase/api");
function search_member(usernameToFind, members) {
    const auxiliar = usernameToFind.replace('@', '');
    for (let i = 0; i < members.length; i++)
        if (members[i].username == auxiliar)
            return members[i];
    return undefined;
}
function findIdByName(arr, name) {
    const obj = arr.find((item) => item.name === name);
    return obj ? obj.id : undefined;
}
function list_areas_mebers(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const area = ctx.match[0].replace("/list_members ", "");
        const idTelegramGroup = String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id);
        const response = yield (0, api_1.getAreaMembers)(idTelegramGroup, String(area));
        if (response.length == 0) {
            return ctx.reply('The area members is empty.\nWrite "Individual" or "Areas" for the selection of members. ');
        }
        else {
            const members = response.map(a => `${a.name}(@${a.username})`).join('\n');
            return ctx.reply(`Members of the "${area}" area:\n\n${members}`);
        }
    });
}
exports.list_areas_mebers = list_areas_mebers;
function assign_members(ctx) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.message.text == "Stop") {
            ctx.wizard.next();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
        }
        //Selección Individual
        else if (ctx.scene.session.bandMember == 'Choice_options') {
            if (ctx.message.text == "1") {
                ctx.scene.session.bandMember = "Individual";
                yield ctx.reply("Type the members' usernames (using @), one by one. To finish, type Stop.");
            }
            else if (ctx.message.text == "2") {
                ctx.scene.session.bandMember = "Select_areas";
                const list_areas = yield (0, api_1.getAreas)((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id);
                let listAreas = '';
                for (let i = 0; i < list_areas.length; i++)
                    listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n";
                yield ctx.reply(listAreas + "\n" + "Write the number of the team area");
            }
            else
                yield ctx.reply("Wrong number, please reescribe the option");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        //Selección Areas
        else if (ctx.scene.session.bandMember == "Select_areas") {
            const list_areas = yield (0, api_1.getAreas)((_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id);
            const index = Number(ctx.message.text);
            //Si la opción de la area está dentro del rango
            if ((index - 1) < list_areas.length) {
                let show_members = '';
                ctx.scene.session.idArea = String(list_areas[index - 1].id);
                const list_area_members = yield (0, api_1.getAreaMembers)((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id, ctx.scene.session.idArea);
                console.log('*' + list_area_members);
                //Si existen miembros del área
                if (0 < list_area_members.length) {
                    for (let i = 0; i < list_area_members.length; i++)
                        show_members += String(i + 1) + ".- @" + list_area_members[i].username + '\n';
                    show_members += '\nPress\n1.- Add all members\n2.- Add one by one';
                    ctx.reply(show_members);
                    ctx.scene.session.bandMember = "Select_option_assign";
                }
                else
                    yield ctx.reply("The area is empty\nWrite the number for the member assignment type:\n1.- Individual (one for one)\n2.- Group area");
            }
            else
                yield ctx.reply("The area does not exist, please rewrite the number");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        //Tipo de asignación para el área
        else if (ctx.scene.session.bandMember == "Select_option_assign") {
            //Retorna todos los miembros
            if (ctx.message.text == '1') {
                ctx.scene.session.members = yield (0, api_1.getAreaMembers)((_d = ctx.chat) === null || _d === void 0 ? void 0 : _d.id, ctx.scene.session.idArea);
                console.log(ctx.scene.session.members);
                ctx.wizard.next();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
            //Los aregará uno por uno
            else {
                ctx.scene.session.bandMember = "Area_individual";
                return ctx.wizard.selectStep(ctx.wizard.cursor);
            }
        }
        //Agregar manualmente uno por uno.
        else if (ctx.scene.session.bandMember == "Area_individual" || ctx.scene.session.bandMember == "Individual") {
            let list_members;
            const username = ctx.message.text;
            if (ctx.scene.session.bandMember == "Area_individual")
                list_members = yield (0, api_1.getAreaMembers)((_e = ctx.chat) === null || _e === void 0 ? void 0 : _e.id, ctx.scene.session.idArea);
            else
                list_members = yield (0, api_1.getGroupMembers)((_f = ctx.chat) === null || _f === void 0 ? void 0 : _f.id);
            const memberFind = search_member(username, list_members);
            //Si no está
            if (!memberFind)
                yield ctx.reply("undefined user, type it again");
            else {
                if (ctx.scene.session.members.includes(memberFind))
                    yield ctx.reply("The user is already on the list, type it again.");
                else
                    ctx.scene.session.members.push(memberFind);
            }
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
        //Si no escriben una opción válida
        else {
            yield ctx.reply("Incorrect option, please write the correct message");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
    });
}
exports.assign_members = assign_members;

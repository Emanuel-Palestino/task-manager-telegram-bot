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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const bot_1 = __importDefault(require("../bot"));
const api_1 = require("../firebase/api");
const areaAss_wizard = new telegraf_1.Scenes.WizardScene("assign_area", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const list_areas = yield (0, api_1.getAreas)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id));
    let listAreas = '';
    for (let i = 0; i < list_areas.length; i++)
        listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n";
    yield ctx.reply(listAreas + "\n" + "Write the number of the team area");
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const list_areas = yield (0, api_1.getAreas)(String((_b = ctx.chat) === null || _b === void 0 ? void 0 : _b.id));
    const index = Number(ctx.message.text);
    //Si la opción de la area está dentro del rango
    if ((index - 1) < list_areas.length) {
        let show_members = '';
        ctx.scene.session.idAuxiliar = String(list_areas[index - 1].id);
        const list_area_members = yield (0, api_1.getAreaMembers)(String((_c = ctx.chat) === null || _c === void 0 ? void 0 : _c.id), ctx.scene.session.idAuxiliar);
        //Si existen miembros del área
        if (list_area_members.length > 0) {
            for (let i = 0; i <= list_area_members.length; i++)
                show_members += (list_area_members[i].name + " " + list_area_members[i].username + '\n');
            show_members += 'Press\n1.-Add all members\n2.- Add one by one';
            ctx.scene.session.bandMember = "Select_option_assign";
        }
        else
            yield ctx.reply("The area members is empty.\nWrite 'Individual' or 'Areas' for the selection of members.");
    }
}));
const stage = new telegraf_1.Scenes.Stage([areaAss_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command("assign_area", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter("assign_area");
}));

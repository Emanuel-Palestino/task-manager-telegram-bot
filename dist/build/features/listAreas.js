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
exports.list_areas = void 0;
const api_1 = require("../firebase/api");
function list_areas(ctx) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        //Selección Individual
        if (ctx.scene.session.bandMember == undefined) {
            ctx.scene.session.bandMember = "Select_areas";
            const list_areas = yield (0, api_1.getAreas)((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id);
            let listAreas = '';
            for (let i = 0; i < list_areas.length; i++)
                listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n";
            yield ctx.reply(listAreas + "\n" + "Write the number of the team area");
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
                ctx.wizard.next();
                return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            }
            else
                yield ctx.reply("The area does not exist, please rewrite the number");
            return ctx.wizard.selectStep(ctx.wizard.cursor);
        }
    });
}
exports.list_areas = list_areas;

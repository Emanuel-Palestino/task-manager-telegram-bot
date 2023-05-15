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
bot_1.default.command('list_areas', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.getAreas)(String(ctx.chat.id));
    console.log(response);
    return ctx.reply("Areas", telegraf_1.Markup.keyboard(response.map(a => a.name)));
}));
bot_1.default.command('list_member', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.getAreas)(String(ctx.chat.id));
    console.log(response);
    return ctx.reply(response.map(a => a.name).join('\n'));
}));
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
bot_1.default.command('create_area', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, api_1.createArea)(String(ctx.chat.id), { name: ctx.message.text.split(' ')[1] }))
        return ctx.reply("Se creo la area.");
    return ctx.reply("No se creo la area.");
}));
bot_1.default.command('create_group', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, api_1.registerTelegramGroup)(String(ctx.chat.id)))
        return ctx.reply("Se creo el grupo.");
    return ctx.reply("No se creo el grupo.");
}));

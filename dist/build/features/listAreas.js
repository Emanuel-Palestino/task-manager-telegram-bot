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
    return ctx.reply("Areas", telegraf_1.Markup.inlineKeyboard(response.map(a => telegraf_1.Markup.button.callback(a.name, "/list_member " + a.name)), {
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
    }));
}));
bot_1.default.action(/\/list_member ([a-zA-Z\xA1-\xFF]+)/, ctx => {
    const area = ctx.match[0].split(" ")[1];
    return ctx.answerCbQuery(`Escojiste el área: ${area} `);
});

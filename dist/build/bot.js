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
const telegraf_1 = require("telegraf");
const messages_1 = require("./constants/messages");
const api_1 = require("./firebase/api");
const bot = new telegraf_1.Telegraf(process.env.TOKEN || '');
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers > 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.replyWithHTML(messages_1.initialMessage);
}));
bot.command('myteam', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers == 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.replyWithHTML(messages_1.teamAddedMessage, telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('Join the team', 'join')
    ])).then(message => {
        bot.telegram.pinChatMessage(ctx.chat.id, message.message_id);
    });
}));
bot.action('join', ctx => {
    return ctx.answerCbQuery('Welcome to the team!');
});
bot.command('members', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers == 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.reply('Members:\n');
}));
bot.command('test', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, api_1.createTask)(ctx.chat.id, { title: 'Creada desde servidor', description: 'Tarea creada desde el servidor de pruebas' });
    if (!response)
        return console.log('No existe el grupo');
    return console.log('agregado');
}));
exports.default = bot;

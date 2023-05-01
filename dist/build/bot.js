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
// Create bot
const bot = new telegraf_1.Telegraf(process.env.TOKEN || '');
// Start command, only available in a private chat
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete message if not in a private chat
    if (ctx.chat.type !== 'private')
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.replyWithHTML(messages_1.initialMessage);
}));
// "Register team group" command, only available in a group
bot.command('register_workteam', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, id } = ctx.chat;
    // Delete message if in a private chat
    if (type === 'private')
        return ctx.deleteMessage(ctx.message.message_id);
    // Register team
    const response = yield (0, api_1.registerTelegramGroup)(String(id));
    // Registration failed
    if (!response)
        return yield ctx.reply('Registration failed or workteam already registered.');
    // Send successfully message
    yield ctx.reply(messages_1.teamAddedMessage[0]);
    const message = yield ctx.replyWithHTML(messages_1.teamAddedMessage[1], telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback('Join the team', 'join')
    ]));
    // Pin message
    return yield ctx.pinChatMessage(message.message_id);
}));
bot.action('join', ctx => {
    return ctx.answerCbQuery('Welcome to the team!');
});
bot.use((0, telegraf_1.session)());
exports.default = bot;

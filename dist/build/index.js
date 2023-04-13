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
const dotenv_1 = __importDefault(require("dotenv"));
const messages_1 = require("./utils/messages");
// Config environment
dotenv_1.default.config();
let members = [];
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
    var _a, _b;
    members.push({
        id: (_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id,
        name: (_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name
    });
    console.log(members);
    return ctx.answerCbQuery('Welcome to the team!');
});
bot.command('/members', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers == 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.reply('Members:\n' + members.map(member => member.name).join('\n'));
}));
// Launch bot
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

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
const telegraf_1 = __importDefault(require("telegraf"));
const telegraf_test_1 = require("telegraf-test");
describe('Bot', () => {
    let bot;
    beforeEach(() => {
        bot = new telegraf_1.default(process.env.BOT_TOKEN);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield bot.stop();
    }));
    it('should respond with a message and a button when receiving the /start command', () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = new telegraf_test_1.TelegrafContext({
            message: { chat: { id: 123, type: 'private' }, text: '/start' },
        });
        yield bot.handleUpdate(ctx.update);
        expect(ctx.reply.mock.calls).toEqual([
            ['¡Hola! Presiona el botón para recibir un mensaje.'],
            [
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Enviar mensaje', callback_data: 'message' }],
                        ],
                    },
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                    reply_to_message_id: undefined,
                },
            ],
        ]);
    }));
    it('should respond with a message when pressing the button', () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = new telegraf_test_1.TelegrafContext({
            callbackQuery: { id: '1', data: 'message', message: { chat: { id: 123 } } },
        });
        yield bot.handleUpdate(ctx.update);
        expect(ctx.answerCbQuery.mock.calls).toEqual([['Enviando mensaje...']]);
        expect(ctx.reply.mock.calls).toEqual([
            ['Este es un mensaje enviado desde el bot.'],
        ]);
    }));
});

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
const bot = new telegraf_1.Telegraf(process.env.TOKEN || '');
class Grupo {
    constructor(nombre) {
        this.nombre = nombre;
        this.integrantes = [];
        this.tareas = [];
    }
    agregarIntegrante(integrante) {
        this.integrantes.push(integrante);
    }
    obtenerIntegrantes() {
        return this.integrantes;
    }
    dividirEnSalas(numSalas) {
        const salas = [];
        const integrantesPorSala = Math.ceil(this.integrantes.length / numSalas);
        for (let i = 0; i < numSalas; i++) {
            const inicio = i * integrantesPorSala;
            const fin = inicio + integrantesPorSala;
            const sala = this.integrantes.slice(inicio, fin);
            salas.push(`Sala ${i + 1}: ${sala.join(", ")}`);
        }
        return salas;
    }
}
const grupos = {};
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
bot.command('crear_grupo', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = ctx.chat.id;
    const nombreGrupo = ctx.message.text.split(' ')[1];
    if (!nombreGrupo) {
        return ctx.reply('Debes especificar un nombre para el grupo.');
    }
    if (grupos[nombreGrupo]) {
        return ctx.reply(`Ya existe un grupo con el nombre ${nombreGrupo}.`);
    }
    grupos[nombreGrupo] = new Grupo(nombreGrupo);
    return ctx.reply(`El grupo ${nombreGrupo} ha sido creado correctamente.`);
}));
exports.default = bot;

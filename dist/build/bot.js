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
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers > 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.replyWithHTML(messages_1.initialMessage);
}));

class Grupo {
    constructor(nombre) {
        this.nombre = nombre;
        this.integrantes = [];
        this.tareas = [];
    }
  
    agregarUsuario(usuario) {
      this.usuarios.push(usuario);
    }
  
    getUsuarios() {
      return this.usuarios;
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
bot.command('/members', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let numMembers = yield ctx.getChatMembersCount();
    if (numMembers == 2)
        return ctx.deleteMessage(ctx.message.message_id);
    return ctx.reply('Members:\n');
}));

bot.command('crear_grupo', async (ctx) => {
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
  });
  bot.command('unir_grupo', async (ctx) => {
    const chatId = ctx.chat.id;
    const nombreGrupo = ctx.message.text.split(' ')[1];
    if (!nombreGrupo) {
      return ctx.reply('Debes especificar un nombre para el grupo.');
    }
    const grupo = grupos[nombreGrupo];
    if (!grupo) {
      return ctx.reply(`El grupo ${nombreGrupo} no existe.`);
    }
    grupo.agregarUsuario(chatId);
    return ctx.reply(`Te has unido al grupo ${nombreGrupo}.`);
  });
  
  bot.command('ver_grupos', async (ctx) => {
    let mensaje = '';
    for (const nombreGrupo in grupos) {
      const grupo = grupos[nombreGrupo];
      const usuarios = grupo.getUsuarios().length;
      mensaje += `Grupo: ${nombreGrupo}, Usuarios: ${usuarios}\n`;
    }
    return ctx.reply(mensaje || 'No hay grupos creados.');
  });

  bot.command('dividir_grupo', async (ctx) => {
    const chatId = ctx.chat.id;
    const nombreGrupo = ctx.message.text.split(' ')[1];
    const numSalas = ctx.message.text.split(' ')[2];
    if (!nombreGrupo || !numSalas) {
      return ctx.reply('Debes especificar el nombre del grupo y el número de salas en las que quieres dividirlo.');
    }
    if (!grupos[nombreGrupo]) {
      return ctx.reply(`No existe un grupo con el nombre ${nombreGrupo}.`);
    }
    if (isNaN(numSalas) || numSalas < 1) {
      return ctx.reply('El número de salas debe ser un número entero positivo.');
    }
    const salas = grupos[nombreGrupo].dividirEnSalas(numSalas);
    let respuesta = `El grupo ${nombreGrupo} ha sido dividido en ${numSalas} salas con los siguientes nombres:\n\n`;
    salas.forEach((sala, index) => {
    respuesta += `Sala ${index + 1}: ${sala}\n`;
    });
    return ctx.reply(respuesta);
  });
  
exports.default = bot;

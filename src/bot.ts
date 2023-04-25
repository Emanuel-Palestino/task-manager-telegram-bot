import { Markup, Telegraf } from 'telegraf'
import { initialMessage, teamAddedMessage } from './constants/messages'


const bot = new Telegraf(process.env.TOKEN || '')
class Grupo {
    nombre: string;
    integrantes: string[];
    tareas: string[];

    constructor(nombre: string) {
        this.nombre = nombre;
        this.integrantes = [];
        this.tareas = [];
    }

    agregarIntegrante(integrante: string) {
        this.integrantes.push(integrante);
    }

    obtenerIntegrantes() {
        return this.integrantes;
    }

    dividirEnSalas(numSalas: number) {
        const salas: string[] = [];
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
const grupos: {[nombreGrupo: string]: Grupo} = {};

bot.start(async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers > 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.replyWithHTML(initialMessage)
})

bot.command('myteam', async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers == 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.replyWithHTML(teamAddedMessage,
		Markup.inlineKeyboard([
			Markup.button.callback('Join the team', 'join')
		])
	).then(message => {
		bot.telegram.pinChatMessage(ctx.chat.id, message.message_id)
	})
})

bot.action('join', ctx => {
	return ctx.answerCbQuery('Welcome to the team!')
})

bot.command('/members', async ctx => {
	let numMembers = await ctx.getChatMembersCount()
	if (numMembers == 2)
		return ctx.deleteMessage(ctx.message.message_id)

	return ctx.reply('Members:\n')
})
bot.command('crear_grupo', async (ctx) => {
	const chatId: number = ctx.chat.id;
	const nombreGrupo: string = ctx.message.text.split(' ')[1];
	if (!nombreGrupo) {
	  return ctx.reply('Debes especificar un nombre para el grupo.');
	}
	if (grupos[nombreGrupo]) {
	  return ctx.reply(`Ya existe un grupo con el nombre ${nombreGrupo}.`);
	}
	grupos[nombreGrupo] = new Grupo(nombreGrupo);
	return ctx.reply(`El grupo ${nombreGrupo} ha sido creado correctamente.`);
  });



export default bot
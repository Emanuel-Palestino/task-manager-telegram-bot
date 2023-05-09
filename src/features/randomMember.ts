import { assign_members } from "./AssignParticipants";
import { Scenes } from "telegraf"
import { Message } from 'telegraf/typings/core/types/typegram'
import bot from '../bot'

let listMembers: any[]

function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	
	for (let i = shuffled.length - 1; i > 0; i--) {
	  const j = Math.floor(Math.random() * (i + 1));
	  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	
	return shuffled;
  }

const randomMember = new Scenes.WizardScene<Scenes.WizardContext>(
	'random_member',
	async (ctx) => {
		await ctx.reply("Please, select the members.")
		return ctx.wizard.next()
	},

	assign_members,

	async (ctx) => {
		listMembers = ctx.scene.session.members
		await ctx.reply("Please, enter the number of members to choose.")
		return ctx.wizard.next()
	},
	async (ctx) => {
		const numberMembers = (ctx.message as Message.TextMessage).text

		listMembers = shuffle(listMembers);

		let message = '\n';
		for (let index = 0; index < parseInt(numberMembers); index++) {
			const member = shuffle(listMembers)[0]
			message += `\n${member.name}(@${member.username})`

		}

		await ctx.reply(`Members randomly selected:${message}`)
		return await ctx.scene.leave()
	},
)

const stage = new Scenes.Stage<Scenes.WizardContext>([randomMember])
bot.use(stage.middleware())

bot.command('random_member', async ctx => {
	return await ctx.scene.enter('random_member')
})
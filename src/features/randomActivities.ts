import { assign_members } from "./AssignParticipants";
import { Scenes } from "telegraf"
import { Message } from 'telegraf/typings/core/types/typegram'
import bot from '../bot'

let listActivities: any[]
let listMembers: any[]

const randomActivities = new Scenes.WizardScene<Scenes.WizardContext>(
	'random_activities',
	async (ctx) => {
		await ctx.reply("Please, enter the activities separated by a line break.")
		return ctx.wizard.next()
	},
	
	async (ctx) => {
		listActivities = (ctx.message as Message.TextMessage).text.split("\n")
		await ctx.reply("Please, select the members with whom the activities will be drawn.")
		return ctx.wizard.next()
	},

	assign_members,

	async (ctx) => {
		listMembers = ctx.scene.session.members
		
		const shuffle = (array: any) => {
			array.sort(() => Math.random() - 0.5);
		}

		shuffle(listActivities);
		shuffle(listMembers);
		const assignments = new Map<string, string>();

		listActivities.forEach((activities, index) => {
			const member = listMembers[index % listMembers.length]
			const key = `${member.name}(@${member.username})`
			if(!assignments.has(key))
				assignments.set(key, activities);
			else{
				const assignment = assignments.get(key)
				assignments.set(key, `${assignment}, ${activities}`);
			}
		});
		
		let message = '\n\n';
		assignments.forEach((activity,member) => {
			message += `${member} => ${activity}\n`;
			});
		
		await ctx.reply(`The draw was as follows:${message}`)
		return await ctx.scene.leave()
	},
)

const stage = new Scenes.Stage<Scenes.WizardContext>([randomActivities])
bot.use(stage.middleware())

bot.command('random_activities', async ctx => {
	return await ctx.scene.enter('random_activities')
})
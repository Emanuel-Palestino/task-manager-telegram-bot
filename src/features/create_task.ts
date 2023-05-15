import { Scenes } from 'telegraf'
import { callbackQuery } from 'telegraf/filters'
import { Message } from 'telegraf/typings/core/types/typegram'
import { customWizardContext } from '../models/customWizardContext'
import { createTask } from '../firebase/api'
import { generateCalendarKeyboardAnio, bot_function, } from './calendar'
import { assign_members } from './AssignParticipants'
import bot from '../bot'

const valid_task_name = (areaTask: string): Boolean => {
	if (areaTask.length > 30) return false
	return true
};

const task_wizard = new Scenes.WizardScene<customWizardContext>(
	"create_task",

	async (ctx) => {
		await ctx.reply("Please, enter the name of the new task");
		ctx.scene.session.new_task = {
			title: "",
			description: "",
			participants: {},
		};

		ctx.scene.session.members = []
		ctx.scene.session.bandMember = 'Choice_options'

		return ctx.wizard.next()
	},

	//Get the Task name
	async (ctx) => {
		if (!valid_task_name((ctx.message as Message.TextMessage).text)) {
			await ctx.reply("Please give me a valid task name.")
			return ctx.wizard.selectStep(1)
		}

		ctx.scene.session.new_task.title = (ctx.message as Message.TextMessage).text

		await ctx.reply("Write the numer for the member assignment type:\n1.- Individual (one for one)\n2.- Group area")
		return ctx.wizard.next()
	},

	//Assign the members
	assign_members,

	//Get date
	async (ctx) => {
		ctx.scene.session.members
		ctx.reply("Pick a year:", {
			reply_markup: {
				inline_keyboard: generateCalendarKeyboardAnio(),
			},
		});
	},

	//Get the Description task
	async (ctx) => {
		console.log(ctx.scene.session.date)
		ctx.reply('Please, write the description of the group.')
		return ctx.wizard.next()
	},

	async (ctx) => {
		ctx.scene.session.new_task.description = (ctx.message as Message.TextMessage).text
		const response = await createTask(String(ctx.chat?.id), ctx.scene.session.new_task)
		if (response)
			await ctx.reply(`The "${ctx.scene.session.new_task.title}" task was registered successfully!`)
		else
			await ctx.reply('Error')

		return ctx.scene.leave()

	}

);

task_wizard.on(callbackQuery("data"), (ctx) => {
	bot_function(ctx)
});




const stage = new Scenes.Stage<customWizardContext>([task_wizard]);
bot.use(stage.middleware())

bot.command("create_task", async (ctx) => {
	return await ctx.scene.enter("create_task")
})
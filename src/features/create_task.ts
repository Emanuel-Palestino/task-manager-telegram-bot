import { Scenes, MiddlewareFn, Context } from "telegraf"
import { Message } from 'telegraf/typings/core/types/typegram'
import { Task } from "../models/models"
import { createTask } from "../firebase/api"
import bot from '../bot'

const newTask: Task = {
	id: '',
	title: '',
	description: ''
}

function info_user(message: any) {
	const entities = (message as Message.TextMessage).entities
	if (entities)
		return (entities[0] as any).user
}

const valid_task_name = (areaTask: string): Boolean => {
	if (areaTask.length > 30)
		return false

	return true
}

const task_wizard = new Scenes.WizardScene<Scenes.WizardContext>(
	'create_task',
	async (ctx) => {
		await ctx.reply("Please, enter the name of the new task")
		return ctx.wizard.next()
	},
	async (ctx) => {
		if (!valid_task_name((ctx.message as Message.TextMessage).text)) {
			await ctx.reply('Please give me a valid task name.')
			return ctx.wizard.selectStep(1) 
		}
		const task_name = (ctx.message as Message.TextMessage).text
		newTask.title = task_name
		await ctx.reply("Please, enter the desription of the task")
		return ctx.wizard.next()
	},

	async (ctx) => {
		const task_description = (ctx.message as Message.TextMessage).text
		newTask.description = String(task_description)
		const response = await createTask(String(ctx.chat?.id), newTask)
		if (response)
			await ctx.reply(`The "${newTask.title}" task was registered successfully!`)
		else
			await ctx.reply('Error')

		return await ctx.scene.leave()
	},
)

const stage = new Scenes.Stage<Scenes.WizardContext>([task_wizard])
bot.use(stage.middleware())

bot.command('create_task', async ctx => {
	return await ctx.scene.enter('create_task')
})


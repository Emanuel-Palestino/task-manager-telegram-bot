import {Scenes} from "telegraf";
import { Message } from 'telegraf/typings/core/types/typegram'
import bot from '../bot'


const task_wizard = new Scenes.WizardScene<Scenes.WizardContext>(
	'create_task',
	async (ctx) => {
		await ctx.reply("Please, enter the name of the new task")
		return ctx.wizard.next()
	},
	async (ctx) => {
		const task_name = (ctx.message as Message.TextMessage).text
		await ctx.reply("Please, enter the desription of the task");
		return ctx.wizard.next();
	},

	async (ctx) => {
        const task_description = (ctx.message as Message.TextMessage).text
		await ctx.reply("please assign the task manager");
		return ctx.wizard.next();
	},

    async (ctx) => {
        const task_manager = (ctx.message as Message.TextMessage).text
		await ctx.reply("please set the delivery date");
		return ctx.wizard.next();
	},

	async (ctx) => {
        const task_date = (ctx.message as Message.TextMessage).text
		await ctx.reply("Done");
		return await ctx.scene.leave();
	},
);

const stage = new Scenes.Stage<Scenes.WizardContext>([task_wizard]);
bot.use(stage.middleware());

bot.command('create_task',async ctx =>{ 
	
	await ctx.reply("Entramos")
	return await ctx.scene.enter('create_task')
	
		 
})
//bot.use(session());

//bot.hears("create_task", ctx => { return ctx.scene.enter("create_task");});
//bot.command('create_task', async (ctx) => {await ctx.scene.enter('create_task')})
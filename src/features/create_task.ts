import {Scenes, MiddlewareFn, Context} from "telegraf";
import { Message } from 'telegraf/typings/core/types/typegram'
import { Task } from "../models/models";
import { createTask } from "../firebase/api";
import bot from '../bot'

const newTask:Task = {
	id:'',
	title: '',
	description: '',
	participants:{'ouiou':{id:'',name:'',username:''}}
}

function info_user(message:any){
	const entities = (message as Message.TextMessage).entities
		if (entities)
			return (entities[0] as any).user
}

const task_wizard = new Scenes.WizardScene<Scenes.WizardContext>(
	'create_task',
	async (ctx) => {
		await ctx.reply("Please, enter the name of the new task")
		return ctx.wizard.next()
	},
	async (ctx) => {
		
		newTask.title = (ctx.message as Message.TextMessage).text
		console.log(newTask.title)
		await ctx.reply("Please, enter the desription of the task");
		return ctx.wizard.next();
	},

	/*async (ctx) => {
    
		[,newTask.description] = (ctx.message as Message.TextMessage).text.split('/')
		await ctx.reply("Please assign the task manager");
		return ctx.wizard.next();
	},

    async (ctx) => {
		//Manager
		await ctx.reply("Please set the delivery date");
		return ctx.wizard.next();
	},*/

	async (ctx) => {
        //Date
		[,newTask.description] = (ctx.message as Message.TextMessage).text.split('/')
		const response = await createTask(String(ctx.chat?.id),newTask)

		if(response)
			await ctx.reply(`The "${newTask.title}" area was registered successfully!`)
		else
			await ctx.reply('Error')
		
		return await ctx.scene.leave();
	},
);

const stage = new Scenes.Stage<Scenes.WizardContext>([task_wizard]);
bot.use(stage.middleware());

bot.command('create_task',async ctx =>{ 
	return await ctx.scene.enter('create_task');	 
})



//bot.use(session());

//bot.hears("create_task", ctx => { return ctx.scene.enter("create_task");});
//bot.command('create_task', async (ctx) => {await ctx.scene.enter('create_task')})
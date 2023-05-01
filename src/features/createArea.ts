import { Scenes } from 'telegraf'
import bot from '../bot'
import { createArea } from '../firebase/api'
import { Message } from 'telegraf/typings/core/types/typegram'


const validAreaName = (areaName: string): Boolean => {
	if (areaName.length > 30)
		return false

	return true
}


const createAreaWizard = new Scenes.WizardScene<Scenes.WizardContext>(
	'create-area-wizard',
	async ctx => {
		await ctx.reply('Please give me the new area name.')
		return ctx.wizard.next()
	},
	async ctx => {
		const areaName = (ctx.message as Message.TextMessage).text.trim()

		if (!validAreaName(areaName)) {
			await ctx.reply('Please give me a valid area name.')
			return ctx.wizard.selectStep(1)
		}

		const response = await createArea(String(ctx.chat?.id), { name: areaName })
		if (response)
			await ctx.reply(`The "${areaName}" area was registered successfully!`)
		else
			await ctx.reply('Error')

		return await ctx.scene.leave()
	}
)

const createAreaStage = new Scenes.Stage<Scenes.WizardContext>([createAreaWizard])

bot.use(createAreaStage.middleware())

bot.command('create_area', async ctx => {
	let [, areaName] = ctx.message.text.split('/create_area')
	areaName = areaName.trim()
	const idTelegramGroup = ctx.chat.id

	// Create area if area name was given
	if (areaName) {
		// Validate area name
		if (!validAreaName(areaName))
			return await ctx.reply('Error')

		const response = await createArea(String(idTelegramGroup), { name: areaName })
		if (response)
			return await ctx.reply(`The "${areaName}" area was registered successfully!`)
		else
			return await ctx.reply('Error')

	} else {
		// Start scene to create area
		return await ctx.scene.enter('create-area-wizard')
	}
})

bot.command('hola', ctx => ctx.reply('Hola'))

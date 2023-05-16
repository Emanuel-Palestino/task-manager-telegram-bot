/* 
*	Module for create work space
*/

import { Scenes } from 'telegraf'
import bot from '../bot'
import { createWorkSpace } from '../firebase/api'
import { Message } from 'telegraf/typings/core/types/typegram'
import { customWizardContext } from '../models/customWizardContext'


const validWorkSpaceName = (name: string): Boolean => {
	if (name.length > 30)
		return false

	return true
}


// Wizard scene to create work space
const createWorkSpaceWizard = new Scenes.WizardScene<customWizardContext>(
	'create-workspace-wizard',
	async ctx => {
		await ctx.reply('Please give me the new work space name.')
		return ctx.wizard.next()
	},
	async ctx => {
		// Get new work space name
		const workSpaceName = (ctx.message as Message.TextMessage).text.trim()

		// Validate work space name
		if (!validWorkSpaceName(workSpaceName)) {
			// Repeat step if work space name is invalid
			await ctx.reply('Please give me a valid work space name.')
			return ctx.wizard.selectStep(1)
		}

		// Create work space
		const response = await createWorkSpace(String(ctx.chat?.id), { name: workSpaceName })
		if (response)
			await ctx.reply(`The "${workSpaceName}" work space was registered successfully!`)
		else
			await ctx.reply('Error')

		// Exit wizard scene
		return await ctx.scene.leave()
	}
)

const createWorkSpaceStage = new Scenes.Stage<customWizardContext>([createWorkSpaceWizard])

bot.use(createWorkSpaceStage.middleware())


bot.command('create_workspace', async ctx => {
	let [, workSpaceName] = ctx.message.text.split('/create_workspace')
	workSpaceName = workSpaceName.trim()
	const telegramGroupId = ctx.chat.id

	// Create work space if name was given
	if (workSpaceName) {
		// Validate work space name
		if (!validWorkSpaceName(workSpaceName))
			return await ctx.reply('Error')

		// Create work space
		const response = await createWorkSpace(String(telegramGroupId), { name: workSpaceName })
		if (response)
			return await ctx.reply(`The "${workSpaceName}" work space was registered successfully!`)
		else
			return await ctx.reply('Error')

	} else {
		// Start scene to create work space
		return await ctx.scene.enter('create-workspace-wizard')
	}
})

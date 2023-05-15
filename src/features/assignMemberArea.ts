import { Scenes } from 'telegraf'
import { customWizardContext } from '../models/customWizardContext'
import { assign_members } from './AssignParticipants'
import bot from '../bot'
import { list_areas } from './listAreas'
import { addMemberToArea } from '../firebase/api'

const areaAss_wizard = new Scenes.WizardScene<customWizardContext>("assign_area",
	list_areas,

	async (ctx) => {
		ctx.scene.session.members = []
		ctx.scene.session.bandMember = 'Choice_options'

		await ctx.reply("Write the numer for the member assignment type:\n1.- Individual (one for one)\n2.- Group area")
		return ctx.wizard.next()

	},
	assign_members,

	async (ctx) => {
		for (let i = 0; i < ctx.scene.session.members.length; i++) {
			const response = await addMemberToArea(String(ctx.chat?.id), ctx.scene.session.members[i], ctx.scene.session.idArea)
			if (!response)
				await ctx.reply('Error')
		}
		await ctx.reply('The members have been registered')
		ctx.scene.leave()
	}
)

const stage = new Scenes.Stage<customWizardContext>([areaAss_wizard])
bot.use(stage.middleware())

bot.command("assign_area", async (ctx) => {
	return await ctx.scene.enter("assign_area")
})
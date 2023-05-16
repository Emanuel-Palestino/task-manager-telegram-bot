import { Message } from 'telegraf/typings/core/types/typegram'
import { WorkSpace, Person } from '../models/models'
import { getWorkSpaces, getWorkSpacesMembers, getGroupMembers } from '../firebase/api'

function search_member(usernameToFind: String, members: Person[]) {
	const auxiliar = usernameToFind.replace('@', '')
	for (let i = 0; i < members.length; i++)
		if (members[i].username == auxiliar)
			return members[i]
	return undefined
}

function findIdByName(arr: WorkSpace[], name: string): string | undefined {
	const obj = arr.find((item) => item.name === name)
	return obj ? obj.id : undefined
}

export async function list_areas_mebers(ctx: any) {
	const area = ctx.match[0].replace("/list_members ", "")
	const idTelegramGroup = String(ctx.chat?.id)
	const response = await getWorkSpacesMembers(idTelegramGroup, String(area))
	if (response.length == 0) {
		return ctx.reply('The area members is empty.\nWrite "Individual" or "Areas" for the selection of members. ')
	}
	else {
		const members = response.map(a => `${a.name}(@${a.username})`).join('\n')
		return ctx.reply(`Members of the "${area}" area:\n\n${members}`)
	}
}

export async function assign_members(ctx: any): Promise<any> {
	if ((ctx.message as Message.TextMessage).text == "Stop") {
		ctx.wizard.next()
		return ctx.wizard.steps[ctx.wizard.cursor](ctx)

	}

	//Selección Individual
	else if (ctx.scene.session.bandMember == 'Choice_options') {
		if ((ctx.message as Message.TextMessage).text == "1") {
			ctx.scene.session.bandMember = "Individual"
			await ctx.reply("Type the members' usernames (using @), one by one. To finish, type Stop.")
		}

		else if ((ctx.message as Message.TextMessage).text == "2") {
			ctx.scene.session.bandMember = "Select_areas";
			const list_areas = await getWorkSpaces(ctx.chat?.id)
			let listAreas: String = ''
			for (let i = 0; i < list_areas.length; i++)
				listAreas += String(i + 1) + ".- " + list_areas[i].name + "\n"

			await ctx.reply(listAreas + "\n" + "Write the number of the team area")
		}

		else
			await ctx.reply("Wrong number, please reescribe the option")


		return ctx.wizard.selectStep(ctx.wizard.cursor)

	}

	//Selección Areas

	else if (ctx.scene.session.bandMember == "Select_areas") {
		const list_areas = await getWorkSpaces(ctx.chat?.id);
		const index = Number((ctx.message as Message.TextMessage).text)

		//Si la opción de la area está dentro del rango
		if ((index - 1) < list_areas.length) {
			let show_members = ''
			ctx.scene.session.idArea = String(list_areas[index - 1].id)
			const list_area_members = await getWorkSpacesMembers(ctx.chat?.id, ctx.scene.session.idArea)

			console.log('*' + list_area_members)
			//Si existen miembros del área
			if (0 < list_area_members.length) {
				for (let i = 0; i < list_area_members.length; i++)
					show_members += String(i + 1) + ".- @" + list_area_members[i].username + '\n'
				show_members += '\nPress\n1.- Add all members\n2.- Add one by one'
				ctx.reply(show_members)
				ctx.scene.session.bandMember = "Select_option_assign"
			}
			else
				await ctx.reply("The area is empty\nWrite the number for the member assignment type:\n1.- Individual (one for one)\n2.- Group area")
		}
		else
			await ctx.reply("The area does not exist, please rewrite the number")

		return ctx.wizard.selectStep(ctx.wizard.cursor)
	}

	//Tipo de asignación para el área
	else if (ctx.scene.session.bandMember == "Select_option_assign") {
		//Retorna todos los miembros
		if ((ctx.message as Message.TextMessage).text == '1') {
			ctx.scene.session.members = await getWorkSpacesMembers(ctx.chat?.id, ctx.scene.session.idArea)
			console.log(ctx.scene.session.members)
			ctx.wizard.next();
			return ctx.wizard.steps[ctx.wizard.cursor](ctx)
		}

		//Los aregará uno por uno
		else {
			ctx.scene.session.bandMember = "Area_individual"
			return ctx.wizard.selectStep(ctx.wizard.cursor)
		}
	}

	//Agregar manualmente uno por uno.
	else if (ctx.scene.session.bandMember == "Area_individual" || ctx.scene.session.bandMember == "Individual") {
		let list_members: Person[]
		const username = (ctx.message as Message.TextMessage).text

		if (ctx.scene.session.bandMember == "Area_individual")
			list_members = await getWorkSpacesMembers(ctx.chat?.id, ctx.scene.session.idArea)
		else
			list_members = await getGroupMembers(ctx.chat?.id)

		const memberFind = search_member(username, list_members)

		//Si no está
		if (!memberFind)
			await ctx.reply("undefined user, type it again");

		else {
			if (ctx.scene.session.members.includes(memberFind))
				await ctx.reply("The user is already on the list, type it again.");
			else
				ctx.scene.session.members.push(memberFind)

		}

		return ctx.wizard.selectStep(ctx.wizard.cursor)
	}



	//Si no escriben una opción válida
	else {
		await ctx.reply("Incorrect option, please write the correct message")
		return ctx.wizard.selectStep(ctx.wizard.cursor)
	}
}

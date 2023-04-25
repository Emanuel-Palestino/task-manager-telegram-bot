import { database } from './setup'


export const registerTelegramGroup = async (idTelegramGroup: number): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(`${idTelegramGroup}`)
	await teamGroupDoc.set({ grupo: 'algo' })
	return true
}

export const createTask = async (idTelegramGroup: string, task: object): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is no registered
	if (!teamGroupSnapshot.exists)
		return false

	await teamGroupDoc.collection('tasks').add(task)
	return true
}

export const createArea = async (idTelegramGroup: string, area: object): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is no registered
	if (!teamGroupSnapshot.exists)
		return false

	await teamGroupDoc.collection('areas').add(area)
	return true
}

export const testGetInfo = async (): Promise<boolean> => {
	const teamsSnapshot = await database.collection('team_groups').get()
	const team_groups = teamsSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}))

	console.log(team_groups)
	return true
}
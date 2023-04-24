import { database } from './setup'

export const createTask = async (idTelegramGroup: number, task: object): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(`${String(idTelegramGroup)}`)
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is no registered
	if (!teamGroupSnapshot.exists)
		return false

	await teamGroupDoc.collection('tasks').add(task)
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
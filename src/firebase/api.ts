import { database } from './setup'

export const createTask = async (idGroug: number, task: object): Promise<boolean> => {
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
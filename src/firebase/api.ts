import { database } from './setup'


const isTeamGroupRegistered = async (teamGroupDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<boolean> => {
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is no registered
	if (!teamGroupSnapshot.exists)
		return false

	return true
}

export const registerTelegramGroup = async (idTelegramGroup: string): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group alredy registered
	if (await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.set({ grupo: 'algo' })
	return true
}

export const createTask = async (idTelegramGroup: string, task: object): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is no registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('tasks').add(task)
	return true
}

export const createArea = async (idTelegramGroup: string, area: object): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is no registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('areas').add(area)
	return true
}

export const getAreas = async (idTelegramGroup: string): Promise<any[]> => {
	const groupAreasSnapshot = await database.collection(`team_groups/${idTelegramGroup}/areas`).get()
	const groupAreas = groupAreasSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}))
	return groupAreas
}

export const getTasks = async (idTelegramGroup: string): Promise<any[]> => {
	const groupTasksSnapshot = await database.collection(`team_groups/${idTelegramGroup}/tasks`).get()
	const groupTasks = groupTasksSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}))
	return groupTasks
}

export const testGetInfo = async (idTelegramGroup: string): Promise<boolean> => {
	const teamsSnapshot = await database.collection(`team_groups/${idTelegramGroup}/areas`).get()
	const team_groups = teamsSnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}))

	console.log(team_groups)
	return true
}
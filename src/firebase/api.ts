import { Area, Person, Task, TeamGroup } from '../models/models'
import { database } from './setup'


const isTeamGroupRegistered = async (teamGroupDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<boolean> => {
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is not registered
	if (!teamGroupSnapshot.exists)
		return false

	return true
}

export const registerTelegramGroup = async (idTelegramGroup: string): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group alredy registered
	if (await isTeamGroupRegistered(teamGroupDoc))
		return false

	// Add group
	const today = new Date()
	const newGroup: TeamGroup = {
		createdAt: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
	}
	await teamGroupDoc.set(newGroup)
	return true
}


/* CREATE/ADD METHODS */
export const createTask = async (idTelegramGroup: string, task: Task): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('tasks').add(task)
	return true
}

export const createArea = async (idTelegramGroup: string, area: Area): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('areas').add(area)
	return true
}

export const addMemberToTeam = async (idTelegramGroup: string, member: Person): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('members').doc(member.id || '').set(member)
	return true
}

export const addMemberToArea = async (idTelegramGroup: string, member: Person, areaId: string): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	// Create area doc in areasMembers collection
	await teamGroupDoc.collection('areasMembers').doc(areaId).set({})

	// Add member to area
	await teamGroupDoc.collection(`areasMembers/${areaId}/members`).doc(member.id || '').set(member)
	return true
}


/* GET METHODS */
export const getAreas = async (idTelegramGroup: string): Promise<Area[]> => {
	const groupAreasSnapshot = await database.collection(`team_groups/${idTelegramGroup}/areas`).get()
	const groupAreas: Area[] = groupAreasSnapshot.docs.map(doc => ({
		id: doc.id,
		name: doc.get('name'),
		...doc.data()
	}))
	return groupAreas
}

export const getTasks = async (idTelegramGroup: string): Promise<Task[]> => {
	const groupTasksSnapshot = await database.collection(`team_groups/${idTelegramGroup}/tasks`).get()
	const groupTasks: Task[] = groupTasksSnapshot.docs.map(doc => ({
		id: doc.id,
		description: doc.get('description'),
		title: doc.get('title'),
		...doc.data()
	}))
	return groupTasks
}

export const getAreaMembers = async (idTelegramGroup: string, areaId: string): Promise<Person[]> => {
	const groupAreasMembersSnapshot = await database.collection(`team_groups/${idTelegramGroup}/areasMembers/${areaId}/members`).get()
	const members: Person[] = groupAreasMembersSnapshot.docs.map(doc => ({
		id: doc.id,
		name: doc.get('name'),
		username: doc.get('username'),
		...doc.data()
	}))

	return members
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
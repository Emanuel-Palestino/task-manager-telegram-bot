import { WorkSpace, Person, Task, TeamGroup } from '../models/models'
import { database } from './setup'


const isTeamGroupRegistered = async (teamGroupDoc: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<boolean> => {
	const teamGroupSnapshot = await teamGroupDoc.get()

	// team group is not registered
	if (!teamGroupSnapshot.exists)
		return false

	return true
}

export const isMemberRegistered = async (idTelegramGroup: string, memberId: string): Promise<boolean> => {
	const membersGroupSnapshot = await database.doc(`team_groups/${idTelegramGroup}/members/${memberId}`).get()

	return membersGroupSnapshot.exists
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

export const createWorkSpace = async (telegramGroupId: string, workSpace: WorkSpace): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(telegramGroupId)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	await teamGroupDoc.collection('workspaces').add(workSpace)
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

export const addMemberToWorkSpace = async (idTelegramGroup: string, member: Person, workSpaceId: string): Promise<boolean> => {
	const teamGroupDoc = database.collection('team_groups').doc(idTelegramGroup)

	// team group is not registered
	if (! await isTeamGroupRegistered(teamGroupDoc))
		return false

	// Create area doc in areasMembers collection
	await teamGroupDoc.collection('workSpaceMembers').doc(workSpaceId).set({})

	// Add member to area
	await teamGroupDoc.collection(`workSpaceMembers/${workSpaceId}/members`).doc(member.id || '').set(member)
	return true
}


/* GET METHODS */
export const getWorkSpaces = async (idTelegramGroup: string): Promise<WorkSpace[]> => {
	const groupAreasSnapshot = await database.collection(`team_groups/${idTelegramGroup}/workspaces`).get()
	const groupAreas: WorkSpace[] = groupAreasSnapshot.docs.map(doc => ({
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

export const getWorkSpacesMembers = async (idTelegramGroup: string, areaId: string): Promise<Person[]> => {
	const groupAreasMembersSnapshot = await database.collection(`team_groups/${idTelegramGroup}/workSpaceMembers/${areaId}/members`).get()
	const members: Person[] = groupAreasMembersSnapshot.docs.map(doc => ({
		id: doc.id,
		name: doc.get('name'),
		username: doc.get('username'),
		...doc.data()
	}))

	return members
}

export const getGroupMembers = async (idTelegramGroup: string): Promise<Person[]> => {
	const groupSnapshot = await database.collection(`team_groups/${idTelegramGroup}/members`).get()
	const members: Person[] = groupSnapshot.docs.map(doc => ({
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
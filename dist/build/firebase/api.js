"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testGetInfo = exports.getGroupMembers = exports.getWorkSpacesMembers = exports.getTasks = exports.getWorkSpaces = exports.addMemberToWorkSpace = exports.addMemberToTeam = exports.createWorkSpace = exports.createTask = exports.registerTelegramGroup = exports.isMemberRegistered = void 0;
const setup_1 = require("./setup");
const isTeamGroupRegistered = (teamGroupDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupSnapshot = yield teamGroupDoc.get();
    // team group is not registered
    if (!teamGroupSnapshot.exists)
        return false;
    return true;
});
const isMemberRegistered = (idTelegramGroup, memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const membersGroupSnapshot = yield setup_1.database.doc(`team_groups/${idTelegramGroup}/members/${memberId}`).get();
    return membersGroupSnapshot.exists;
});
exports.isMemberRegistered = isMemberRegistered;
const registerTelegramGroup = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group alredy registered
    if (yield isTeamGroupRegistered(teamGroupDoc))
        return false;
    // Add group
    const today = new Date();
    const newGroup = {
        createdAt: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    };
    yield teamGroupDoc.set(newGroup);
    return true;
});
exports.registerTelegramGroup = registerTelegramGroup;
/* CREATE/ADD METHODS */
const createTask = (idTelegramGroup, task) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group is not registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    yield teamGroupDoc.collection('tasks').add(task);
    return true;
});
exports.createTask = createTask;
const createWorkSpace = (telegramGroupId, workSpace) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(telegramGroupId);
    // team group is not registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    yield teamGroupDoc.collection('workspaces').add(workSpace);
    return true;
});
exports.createWorkSpace = createWorkSpace;
const addMemberToTeam = (idTelegramGroup, member) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group is not registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    yield teamGroupDoc.collection('members').doc(member.id || '').set(member);
    return true;
});
exports.addMemberToTeam = addMemberToTeam;
const addMemberToWorkSpace = (idTelegramGroup, member, workSpaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group is not registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    // Create area doc in areasMembers collection
    yield teamGroupDoc.collection('workSpaceMembers').doc(workSpaceId).set({});
    // Add member to area
    yield teamGroupDoc.collection(`workSpaceMembers/${workSpaceId}/members`).doc(member.id || '').set(member);
    return true;
});
exports.addMemberToWorkSpace = addMemberToWorkSpace;
/* GET METHODS */
const getWorkSpaces = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const groupAreasSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/workspaces`).get();
    const groupAreas = groupAreasSnapshot.docs.map(doc => (Object.assign({ id: doc.id, name: doc.get('name') }, doc.data())));
    return groupAreas;
});
exports.getWorkSpaces = getWorkSpaces;
const getTasks = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const groupTasksSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/tasks`).get();
    const groupTasks = groupTasksSnapshot.docs.map(doc => (Object.assign({ id: doc.id, description: doc.get('description'), title: doc.get('title') }, doc.data())));
    return groupTasks;
});
exports.getTasks = getTasks;
const getWorkSpacesMembers = (idTelegramGroup, areaId) => __awaiter(void 0, void 0, void 0, function* () {
    const groupAreasMembersSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/workSpaceMembers/${areaId}/members`).get();
    const members = groupAreasMembersSnapshot.docs.map(doc => (Object.assign({ id: doc.id, name: doc.get('name'), username: doc.get('username') }, doc.data())));
    return members;
});
exports.getWorkSpacesMembers = getWorkSpacesMembers;
const getGroupMembers = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const groupSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/members`).get();
    const members = groupSnapshot.docs.map(doc => (Object.assign({ id: doc.id, name: doc.get('name'), username: doc.get('username') }, doc.data())));
    return members;
});
exports.getGroupMembers = getGroupMembers;
const testGetInfo = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const teamsSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/areas`).get();
    const team_groups = teamsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    console.log(team_groups);
    return true;
});
exports.testGetInfo = testGetInfo;

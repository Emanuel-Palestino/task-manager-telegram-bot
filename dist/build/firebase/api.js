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
exports.testGetInfo = exports.getTasks = exports.getAreas = exports.createArea = exports.createTask = exports.registerTelegramGroup = void 0;
const setup_1 = require("./setup");
const isTeamGroupRegistered = (teamGroupDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupSnapshot = yield teamGroupDoc.get();
    // team group is no registered
    if (!teamGroupSnapshot.exists)
        return false;
    return true;
});
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
const createTask = (idTelegramGroup, task) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group is no registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    yield teamGroupDoc.collection('tasks').add(task);
    return true;
});
exports.createTask = createTask;
const createArea = (idTelegramGroup, area) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    // team group is no registered
    if (!(yield isTeamGroupRegistered(teamGroupDoc)))
        return false;
    yield teamGroupDoc.collection('areas').add(area);
    return true;
});
exports.createArea = createArea;
const getAreas = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const groupAreasSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/areas`).get();
    const groupAreas = groupAreasSnapshot.docs.map(doc => (Object.assign({ id: doc.id, name: doc.get('name') }, doc.data())));
    return groupAreas;
});
exports.getAreas = getAreas;
const getTasks = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const groupTasksSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/tasks`).get();
    const groupTasks = groupTasksSnapshot.docs.map(doc => (Object.assign({ id: doc.id, description: doc.get('description'), title: doc.get('title') }, doc.data())));
    return groupTasks;
});
exports.getTasks = getTasks;
const testGetInfo = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const teamsSnapshot = yield setup_1.database.collection(`team_groups/${idTelegramGroup}/areas`).get();
    const team_groups = teamsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    console.log(team_groups);
    return true;
});
exports.testGetInfo = testGetInfo;

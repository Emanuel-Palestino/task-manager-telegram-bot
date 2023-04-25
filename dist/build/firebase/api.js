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
exports.testGetInfo = exports.createArea = exports.createTask = exports.registerTelegramGroup = void 0;
const setup_1 = require("./setup");
const registerTelegramGroup = (idTelegramGroup) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(`${idTelegramGroup}`);
    yield teamGroupDoc.set({ grupo: 'algo' });
    return true;
});
exports.registerTelegramGroup = registerTelegramGroup;
const createTask = (idTelegramGroup, task) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    const teamGroupSnapshot = yield teamGroupDoc.get();
    // team group is no registered
    if (!teamGroupSnapshot.exists)
        return false;
    yield teamGroupDoc.collection('tasks').add(task);
    return true;
});
exports.createTask = createTask;
const createArea = (idTelegramGroup, area) => __awaiter(void 0, void 0, void 0, function* () {
    const teamGroupDoc = setup_1.database.collection('team_groups').doc(idTelegramGroup);
    const teamGroupSnapshot = yield teamGroupDoc.get();
    // team group is no registered
    if (!teamGroupSnapshot.exists)
        return false;
    yield teamGroupDoc.collection('areas').add(area);
    return true;
});
exports.createArea = createArea;
const testGetInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const teamsSnapshot = yield setup_1.database.collection('team_groups').get();
    const team_groups = teamsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    console.log(team_groups);
    return true;
});
exports.testGetInfo = testGetInfo;

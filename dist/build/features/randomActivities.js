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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AssignParticipants_1 = require("./AssignParticipants");
const telegraf_1 = require("telegraf");
const bot_1 = __importDefault(require("../bot"));
let listActivities;
let listMembers;
const randomActivities = new telegraf_1.Scenes.WizardScene('random_activities', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Please, enter the activities separated by a line break.");
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    listActivities = ctx.message.text.split("\n");
    yield ctx.reply("Please, select the members with whom the activities will be drawn.");
    return ctx.wizard.next();
}), AssignParticipants_1.assign_members, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    listMembers = ctx.scene.session.members;
    const shuffle = (array) => {
        array.sort(() => Math.random() - 0.5);
    };
    shuffle(listActivities);
    shuffle(listMembers);
    const assignments = new Map();
    listActivities.forEach((activities, index) => {
        const member = listMembers[index % listMembers.length];
        const key = `${member.name}(@${member.username})`;
        if (!assignments.has(key))
            assignments.set(key, activities);
        else {
            const assignment = assignments.get(key);
            assignments.set(key, `${assignment}, ${activities}`);
        }
    });
    let message = '\n\n';
    assignments.forEach((activity, member) => {
        message += `${member} => ${activity}\n`;
    });
    yield ctx.reply(`The draw was as follows:${message}`);
    return yield ctx.scene.leave();
}));
const stage = new telegraf_1.Scenes.Stage([randomActivities]);
bot_1.default.use(stage.middleware());
bot_1.default.command('random_activities', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter('random_activities');
}));

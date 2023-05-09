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
let listMembers;
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
const randomMember = new telegraf_1.Scenes.WizardScene('random_member', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Please, select the members.");
    return ctx.wizard.next();
}), AssignParticipants_1.assign_members, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    listMembers = ctx.scene.session.members;
    yield ctx.reply("Please, enter the number of members to choose.");
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const numberMembers = ctx.message.text;
    listMembers = shuffle(listMembers);
    let message = '\n';
    for (let index = 0; index < parseInt(numberMembers); index++) {
        const member = shuffle(listMembers)[0];
        message += `\n${member.name}(@${member.username})`;
    }
    yield ctx.reply(`Members randomly selected:${message}`);
    return yield ctx.scene.leave();
}));
const stage = new telegraf_1.Scenes.Stage([randomMember]);
bot_1.default.use(stage.middleware());
bot_1.default.command('random_member', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter('random_member');
}));

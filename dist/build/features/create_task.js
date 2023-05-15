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
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const api_1 = require("../firebase/api");
const calendar_1 = require("./calendar");
const AssignParticipants_1 = require("./AssignParticipants");
const bot_1 = __importDefault(require("../bot"));
const valid_task_name = (areaTask) => {
    if (areaTask.length > 30)
        return false;
    return true;
};
const task_wizard = new telegraf_1.Scenes.WizardScene("create_task", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Please, enter the name of the new task");
    ctx.scene.session.new_task = {
        title: "",
        description: "",
        participants: {},
    };
    ctx.scene.session.members = [];
    ctx.scene.session.bandMember = 'Choice_options';
    return ctx.wizard.next();
}), 
//Get the Task name
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!valid_task_name(ctx.message.text)) {
        yield ctx.reply("Please give me a valid task name.");
        return ctx.wizard.selectStep(1);
    }
    ctx.scene.session.new_task.title = ctx.message.text;
    yield ctx.reply("Write the numer for the member assignment type:\n1.- Individual (one for one)\n2.- Group area");
    return ctx.wizard.next();
}), 
//Assign the members
AssignParticipants_1.assign_members, 
//Get date
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.session.members;
    ctx.reply("Pick a year:", {
        reply_markup: {
            inline_keyboard: (0, calendar_1.generateCalendarKeyboardAnio)(),
        },
    });
}), 
//Get the Description task
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ctx.scene.session.date);
    ctx.reply('Please, write the description of the group.');
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    ctx.scene.session.new_task.description = ctx.message.text;
    const response = yield (0, api_1.createTask)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id), ctx.scene.session.new_task);
    if (response)
        yield ctx.reply(`The "${ctx.scene.session.new_task.title}" task was registered successfully!`);
    else
        yield ctx.reply('Error');
    return ctx.scene.leave();
}));
task_wizard.on((0, filters_1.callbackQuery)("data"), (ctx) => {
    (0, calendar_1.bot_function)(ctx);
});
const stage = new telegraf_1.Scenes.Stage([task_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command("create_task", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter("create_task");
}));

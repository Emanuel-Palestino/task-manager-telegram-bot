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
    ctx.scene.session.members = {};
    return ctx.wizard.next();
}), 
//Get the Task name
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!valid_task_name(ctx.message.text)) {
        yield ctx.reply("Please give me a valid task name.");
        return ctx.wizard.selectStep(1);
    }
    ctx.scene.session.new_task.title = ctx.message.text;
    yield ctx.reply("Write if you want 'Individual' or 'Areas' for the selection of members.");
    return ctx.wizard.next();
}), 
//Assign the members
AssignParticipants_1.assign_members, 
//Get the Description task
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("Entramos a lo último.");
    ctx.scene.session.new_task.description = ctx.message.text;
    return yield ctx.scene.leave();
}));
//task_wizard.on()
const stage = new telegraf_1.Scenes.Stage([task_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command("create_task", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter("create_task");
}));

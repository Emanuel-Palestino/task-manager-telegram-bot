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
const api_1 = require("../firebase/api");
const bot_1 = __importDefault(require("../bot"));
const newTask = {
    id: '',
    title: '',
    description: '',
    participants: { 'ouiou': { id: '', name: '', username: '' } }
};
function info_user(message) {
    const entities = message.entities;
    if (entities)
        return entities[0].user;
}
const task_wizard = new telegraf_1.Scenes.WizardScene('create_task', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Please, enter the name of the new task");
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    newTask.title = ctx.message.text;
    console.log(newTask.title);
    yield ctx.reply("Please, enter the desription of the task");
    return ctx.wizard.next();
}), 
/*async (ctx) => {

    [,newTask.description] = (ctx.message as Message.TextMessage).text.split('/')
    await ctx.reply("Please assign the task manager");
    return ctx.wizard.next();
},

async (ctx) => {
    //Manager
    await ctx.reply("Please set the delivery date");
    return ctx.wizard.next();
},*/
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //Date
    [, newTask.description] = ctx.message.text.split('/');
    const response = yield (0, api_1.createTask)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id), newTask);
    if (response)
        yield ctx.reply(`The "${newTask.title}" area was registered successfully!`);
    else
        yield ctx.reply('Error');
    return yield ctx.scene.leave();
}));
const stage = new telegraf_1.Scenes.Stage([task_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command('create_task', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter('create_task');
}));
//bot.use(session());
//bot.hears("create_task", ctx => { return ctx.scene.enter("create_task");});
//bot.command('create_task', async (ctx) => {await ctx.scene.enter('create_task')})
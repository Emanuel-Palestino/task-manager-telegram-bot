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
//Get date
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("Pick a year:", {
        reply_markup: {
            inline_keyboard: (0, calendar_1.generateCalendarKeyboardAnio)(),
        },
    });
}), 
//Get the Description task
(ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("Entramos a lo último.");
    /*ctx.scene.session.new_task.description = (
      ctx.message as Message.TextMessage
    ).text;*/
    return yield ctx.scene.leave();
}));
task_wizard.on((0, filters_1.callbackQuery)("data"), (ctx) => {
    let [actionType, actionValue, days] = ctx.callbackQuery.data.split(":");
    switch (actionType) {
        case "anio":
            ctx.answerCbQuery();
            ctx.editMessageText("Pick a month:", {
                reply_markup: {
                    inline_keyboard: (0, calendar_1.generateCalendarKeyboardMonth)(actionValue),
                },
            });
            break;
        case "month":
            ctx.answerCbQuery();
            ctx.editMessageText("Pick a day:", {
                reply_markup: {
                    inline_keyboard: (0, calendar_1.generateCalendarKeyboardDay)(actionValue, days),
                },
            });
            break;
        case "day":
            ctx.scene.session.date = actionValue;
            ctx.answerCbQuery();
            ctx.editMessageText("You choose the date: " + actionValue);
            ctx.wizard.next();
            return ctx.wizard.steps[ctx.wizard.cursor](ctx);
            break;
    }
});
task_wizard.action(/\/list_members .+/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const area = ctx.match[0].replace("/list_members ", "");
    const chatId = (_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id;
    console.log('Entramos areas');
    if (chatId) {
        const response = yield (0, api_1.getAreaMembers)(String(chatId), String(area));
        if (response.length > 0) {
            const members = response.map((a) => `${a.name}(@${a.username})`).join("\n");
            return ctx.reply(`Members of the "${area}"`);
        }
        else
            return ctx.reply('No members in this area');
    }
}));
const stage = new telegraf_1.Scenes.Stage([task_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command("create_task", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter("create_task");
}));

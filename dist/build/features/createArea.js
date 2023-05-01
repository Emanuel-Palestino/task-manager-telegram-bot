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
const bot_1 = __importDefault(require("../bot"));
const api_1 = require("../firebase/api");
const validAreaName = (areaName) => {
    if (areaName.length > 30)
        return false;
    return true;
};
const createAreaWizard = new telegraf_1.Scenes.WizardScene('create-area-wizard', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Please give me the new area name.');
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const areaName = ctx.message.text.trim();
    if (!validAreaName(areaName)) {
        yield ctx.reply('Please give me a valid area name.');
        return ctx.wizard.selectStep(1);
    }
    const response = yield (0, api_1.createArea)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id), { name: areaName });
    if (response)
        yield ctx.reply(`The "${areaName}" area was registered successfully!`);
    else
        yield ctx.reply('Error');
    return yield ctx.scene.leave();
}));
const createAreaStage = new telegraf_1.Scenes.Stage([createAreaWizard]);
bot_1.default.use(createAreaStage.middleware());
bot_1.default.command('create_area', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let [, areaName] = ctx.message.text.split('/create_area');
    areaName = areaName.trim();
    const idTelegramGroup = ctx.chat.id;
    // Create area if area name was given
    if (areaName) {
        // Validate area name
        if (!validAreaName(areaName))
            return yield ctx.reply('Error');
        const response = yield (0, api_1.createArea)(String(idTelegramGroup), { name: areaName });
        if (response)
            return yield ctx.reply(`The "${areaName}" area was registered successfully!`);
        else
            return yield ctx.reply('Error');
    }
    else {
        // Start scene to create area
        return yield ctx.scene.enter('create-area-wizard');
    }
}));
bot_1.default.command('hola', ctx => ctx.reply('Hola'));

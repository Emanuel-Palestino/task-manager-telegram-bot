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
const validWorkSpaceName = (name) => {
    if (name.length > 30)
        return false;
    return true;
};
// Wizard scene to create work space
const createWorkSpaceWizard = new telegraf_1.Scenes.WizardScene('create-workspace-wizard', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply('Please give me the new work space name.');
    return ctx.wizard.next();
}), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get new work space name
    const workSpaceName = ctx.message.text.trim();
    // Validate work space name
    if (!validWorkSpaceName(workSpaceName)) {
        // Repeat step if work space name is invalid
        yield ctx.reply('Please give me a valid work space name.');
        return ctx.wizard.selectStep(1);
    }
    // Create work space
    const response = yield (0, api_1.createWorkSpace)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id), { name: workSpaceName });
    if (response)
        yield ctx.reply(`The "${workSpaceName}" work space was registered successfully!`);
    else
        yield ctx.reply('Error');
    // Exit wizard scene
    return yield ctx.scene.leave();
}));
const createWorkSpaceStage = new telegraf_1.Scenes.Stage([createWorkSpaceWizard]);
bot_1.default.use(createWorkSpaceStage.middleware());
bot_1.default.command('create_workspace', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let [, workSpaceName] = ctx.message.text.split('/create_workspace');
    workSpaceName = workSpaceName.trim();
    const telegramGroupId = ctx.chat.id;
    // Create work space if name was given
    if (workSpaceName) {
        // Validate work space name
        if (!validWorkSpaceName(workSpaceName))
            return yield ctx.reply('Error');
        // Create work space
        const response = yield (0, api_1.createWorkSpace)(String(telegramGroupId), { name: workSpaceName });
        if (response)
            return yield ctx.reply(`The "${workSpaceName}" work space was registered successfully!`);
        else
            return yield ctx.reply('Error');
    }
    else {
        // Start scene to create work space
        return yield ctx.scene.enter('create-workspace-wizard');
    }
}));

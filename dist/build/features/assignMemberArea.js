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
const listAreas_1 = require("./listAreas");
const api_1 = require("../firebase/api");
const areaAss_wizard = new telegraf_1.Scenes.WizardScene("assign_area", listAreas_1.list_areas, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.scene.session.members = [];
    ctx.scene.session.bandMember = 'Choice_options';
    yield ctx.reply("Write the numer for the member assignment type:\n1.- Individual (one for one)\n2.- Group area");
    return ctx.wizard.next();
}), AssignParticipants_1.assign_members, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (let i = 0; i < ctx.scene.session.members.length; i++) {
        const response = yield (0, api_1.addMemberToWorkSpace)(String((_a = ctx.chat) === null || _a === void 0 ? void 0 : _a.id), ctx.scene.session.members[i], ctx.scene.session.idArea);
        if (!response)
            yield ctx.reply('Error');
    }
    yield ctx.reply('The members have been registered');
    ctx.scene.leave();
}));
const stage = new telegraf_1.Scenes.Stage([areaAss_wizard]);
bot_1.default.use(stage.middleware());
bot_1.default.command("assign_area", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ctx.scene.enter("assign_area");
}));

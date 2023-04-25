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
exports.CustomBot = void 0;
const telegraf_1 = require("telegraf");
const api_1 = require("../firebase/api");
class CustomBot extends telegraf_1.Telegraf {
    test() {
        this.command('test', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, api_1.createArea)(String(ctx.chat.id), { name: 'Analisis' });
            if (!response)
                return console.log('No existe el grupo');
            yield (0, api_1.testGetInfo)(String(ctx.chat.id));
            return console.log('agregado');
        }));
    }
}
exports.CustomBot = CustomBot;

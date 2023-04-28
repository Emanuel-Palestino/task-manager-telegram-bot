"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Config environment
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bot_1 = __importDefault(require("./bot"));
// Load bot features
require("./features/testing");
require("./features/create_task");
// Launch bot
bot_1.default.launch();
console.log('Bot running');
// Enable graceful stop
process.once('SIGINT', () => bot_1.default.stop('SIGINT'));
process.once('SIGTERM', () => bot_1.default.stop('SIGTERM'));

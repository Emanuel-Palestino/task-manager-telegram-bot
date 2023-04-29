"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
const filters_1 = require("telegraf/filters");
// Comando para mostrar el selector de fecha
bot_1.default.command('date', (ctx) => {
    ctx.reply('Pick a year:', {
        reply_markup: {
            inline_keyboard: generateCalendarKeyboardAnio(),
        },
    });
});
bot_1.default.on((0, filters_1.callbackQuery)("data"), ctx => {
    let [actionType, actionValue, days] = ctx.callbackQuery.data.split(':');
    switch (actionType) {
        case 'anio':
            ctx.answerCbQuery();
            ctx.editMessageText('Pick a month:', {
                reply_markup: {
                    inline_keyboard: generateCalendarKeyboardMonth(actionValue),
                },
            });
            break;
        case 'month':
            ctx.answerCbQuery();
            ctx.editMessageText('Pick a day:', {
                reply_markup: {
                    inline_keyboard: generateCalendarKeyboardDay(actionValue, days),
                },
            });
            break;
        case 'day':
            ctx.editMessageText(`Date: ${actionValue}`);
            ctx.answerCbQuery();
            break;
    }
});
function generateCalendarKeyboardAnio() {
    const keyboard = [];
    const anios = [
        { name: '2023', anio: 2023 },
        { name: '2024', anio: 2024 },
        { name: '2025', anio: 2025 },
        { name: '2026', anio: 2026 },
        { name: '2027', anio: 2027 }
    ];
    for (let i = 0; i < anios.length; i += 2) {
        const row = [];
        const anio1 = anios[i];
        const anio2 = i + 1 < anios.length ? anios[i + 1] : null;
        row.push({ text: anio1.name, callback_data: `anio:${anio1.anio}` });
        if (anio2) {
            row.push({ text: anio2.name, callback_data: `anio:${anio2.anio}` });
        }
        keyboard.push(row);
    }
    return keyboard;
}
function generateCalendarKeyboardMonth(anio) {
    const keyboard = [];
    const months = [
        { name: 'Enero', days: 31, num: 1 }, { name: 'Febrero', days: 28, num: 2 }, { name: 'Marzo', days: 31, num: 3 }, { name: 'Abril', days: 30, num: 4 }, { name: 'Mayo', days: 31, num: 5 }, { name: 'Junio', days: 30, num: 6 },
        { name: 'Julio', days: 31, num: 7 }, { name: 'Agosto', days: 31, num: 8 }, { name: 'Septiembre', days: 30, num: 9 }, { name: 'Octubre', days: 31, num: 10 }, { name: 'Noviembre', days: 30, num: 11 }, { name: 'Diciembre', days: 31, num: 12 },
    ];
    // Añade botones para cada mes
    for (let i = 0; i < months.length; i += 2) {
        const row = [];
        const month1 = months[i];
        const month2 = i + 1 < months.length ? months[i + 1] : null;
        row.push({ text: month1.name, callback_data: "month:" + anio + "/" + month1.name + ":" + month1.days });
        if (month2) {
            row.push({ text: month2.name, callback_data: "month:" + anio + "/" + month2.name + ":" + month2.days });
        }
        keyboard.push(row);
    }
    return keyboard;
}
function generateCalendarKeyboardDay(anioMonth, days) {
    const keyboard = [];
    const buttonsPerRow = 7;
    const rows = Math.ceil(days / buttonsPerRow);
    let day = 1;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < buttonsPerRow; j++) {
            if (day <= days) {
                row.push({ text: day.toString(), callback_data: "day:" + anioMonth + "/" + day });
                day++;
            }
            else {
                row.push({ text: ' ', callback_data: 'empty' });
            }
        }
        keyboard.push(row);
    }
    return keyboard;
}

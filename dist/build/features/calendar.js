"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../bot"));
const filters_1 = require("telegraf/filters");
const date_fns_1 = require("date-fns");
bot_1.default.command('date', (ctx) => {
    ctx.reply('Pick a year:', {
        reply_markup: {
            inline_keyboard: generateCalendarKeyboardAnio(),
        },
    });
});
bot_1.default.on((0, filters_1.callbackQuery)("data"), ctx => {
    let [actionType, actionValue, days] = ctx.callbackQuery.data.split(':');
    let date;
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
            date = actionValue;
            ctx.editMessageText(`Date: ${date}`);
            ctx.answerCbQuery();
            break;
    }
});
function getDate() {
    bot_1.default.on((0, filters_1.callbackQuery)("data"), ctx => {
        ctx.reply('Pick a year:', {
            reply_markup: {
                inline_keyboard: generateCalendarKeyboardAnio(),
            },
        });
    });
}
function generateCalendarKeyboardAnio() {
    const keyboard = [];
    const anios = [
        { name: '2023', anio: 2023 },
        { name: '2024', anio: 2024 },
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
    let days;
    const months = [
        { name: 'January', num: 0 }, { name: 'February', num: 1 }, { name: 'March', num: 2 }, { name: 'April', num: 3 }, { name: 'May', num: 4 }, { name: 'June', num: 5 },
        { name: 'July', num: 6 }, { name: 'August', num: 7 }, { name: 'September', num: 8 }, { name: 'October', num: 9 }, { name: 'November', num: 10 }, { name: 'December', num: 11 },
    ];
    for (let i = 0; i < months.length; i += 2) {
        const row = [];
        const month1 = months[i];
        const month2 = i + 1 < months.length ? months[i + 1] : null;
        days = (0, date_fns_1.getDaysInMonth)(new Date(Number(anio), month1.num));
        row.push({ text: month1.name, callback_data: "month:" + anio + "/" + month1.name + ":" + days });
        if (month2) {
            days = (0, date_fns_1.getDaysInMonth)(new Date(Number(anio), month2.num));
            row.push({ text: month2.name, callback_data: "month:" + anio + "/" + month2.name + ":" + days });
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

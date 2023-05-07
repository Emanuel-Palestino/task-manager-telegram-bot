import bot from '../bot'
import { Telegraf, Context } from 'telegraf'
import { callbackQuery } from "telegraf/filters"
import moment from "moment";

bot.command('date', (ctx: Context) => {
	ctx.reply('Pick a year:', {
	reply_markup: {
    	inline_keyboard: generateCalendarKeyboardAnio(),
    },
  })
})
bot.on(callbackQuery("data"), ctx => {
    let [actionType, actionValue,days] = ctx.callbackQuery.data.split(':')
	let date
    switch (actionType) {
    	case 'anio':
        	ctx.answerCbQuery()
        	ctx.editMessageText('Pick a month:', {
            	reply_markup: {
                	inline_keyboard: generateCalendarKeyboardMonth(actionValue),
                },
              })
          break
        case 'month':
            ctx.answerCbQuery()
            ctx.editMessageText('Pick a day:', {
            	reply_markup: {
            		inline_keyboard: generateCalendarKeyboardDay(actionValue,days),
              	},
            })
            
          break
        case 'day':
			date = actionValue
        	ctx.editMessageText(`Date: ${date}`)
            ctx.answerCbQuery()
		break
    }

  })
function getDate(){
	bot.on(callbackQuery("data"), ctx => {
	ctx.reply('Pick a year:', {
		reply_markup: {
			inline_keyboard: generateCalendarKeyboardAnio(),
		},
	  })
	})
}
function generateCalendarKeyboardAnio() {
    const keyboard = []
    const anios = [
      { name: '2023', anio: 2023 },
      { name: '2024', anio: 2024 },
    ]
    for (let i = 0; i < anios.length; i += 2) {
    	const row = []
        const anio1 = anios[i]
        const anio2 = i + 1 < anios.length ? anios[i + 1] : null
        row.push({ text: anio1.name, callback_data: `anio:${anio1.anio}` })
        if (anio2) {
        	row.push({ text: anio2.name, callback_data: `anio:${anio2.anio}` })
        }
        keyboard.push(row)
    }
    return keyboard
  }

function generateCalendarKeyboardMonth(anio: any) {
	const keyboard = []
	let days
	const months = [
    	{ name: 'January'},{ name: 'February'},{ name: 'March' },{ name: 'April'},{ name: 'May'},{ name: 'June' },
    	{ name: 'July'},{ name: 'August' },{ name: 'September'},{ name: 'October'}, { name: 'November'},{ name: 'December'}, ]

  	for (let i = 0; i < months.length; i += 2) {
		const row = []
		const month1 = months[i]
		const month2 = i + 1 < months.length ? months[i + 1] : null
		days =  moment(month1.name, "MMMM").daysInMonth();
		row.push({ text: month1.name, callback_data: "month:"+anio+"/"+month1.name+":"+days })
		if (month2) {
			days =  moment(month2.name, "MMMM").daysInMonth();
			row.push({ text: month2.name, callback_data: "month:"+anio+"/"+month2.name+":"+days })
		}
			keyboard.push(row)
  	}
	return keyboard
}

function generateCalendarKeyboardDay(anioMonth: any,days:any) {
  	const keyboard = []
  	const buttonsPerRow = 7;
  	const rows = Math.ceil(days / buttonsPerRow)
	let day = 1
  	for (let i = 0; i < rows; i++) {
    	const row = [];
		for (let j = 0; j < buttonsPerRow; j++) {
			if (day <= days) {
				row.push({ text: day.toString(), callback_data: "day:"+anioMonth+"/"+day });
				day++;
			}else {
				row.push({ text: ' ', callback_data: 'empty' });
			}
		}
    	keyboard.push(row);
  	}
  	return keyboard;  
}
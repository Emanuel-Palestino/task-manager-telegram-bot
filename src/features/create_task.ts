import { Markup, Scenes, Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { customWizardContext } from "../models/customWizardContext";
import { createTask } from "../firebase/api";
import { assign_members } from "./AssignParticipants";
import bot from "../bot";

const valid_task_name = (areaTask: string): Boolean => {
  if (areaTask.length > 30) return false;

  return true;
};

const task_wizard = new Scenes.WizardScene<customWizardContext>(
  "create_task",

  async (ctx) => {
    await ctx.reply("Please, enter the name of the new task");
    ctx.scene.session.new_task = {
      title: "",
      description: "",
      participants: {},
    };
    ctx.scene.session.members = {};

    return ctx.wizard.next();
  },

  //Get the Task name
  async (ctx) => {
    if (!valid_task_name((ctx.message as Message.TextMessage).text)) {
      await ctx.reply("Please give me a valid task name.");
      return ctx.wizard.selectStep(1);
    }

    ctx.scene.session.new_task.title = (
      ctx.message as Message.TextMessage
    ).text;
    await ctx.reply(
      "Write if you want 'Individual' or 'Areas' for the selection of members."
    );
    return ctx.wizard.next();
  },

  //Assign the members
  assign_members,

  //Get the Description task
  async (ctx) => {
    ctx.reply("Entramos a lo último.");
    ctx.scene.session.new_task.description = (
      ctx.message as Message.TextMessage
    ).text;
    return await ctx.scene.leave();
  }
);

//task_wizard.on()
const stage = new Scenes.Stage<customWizardContext>([task_wizard]);
bot.use(stage.middleware());

bot.command("create_task", async (ctx) => {
  return await ctx.scene.enter("create_task");
});

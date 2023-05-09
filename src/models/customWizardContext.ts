import { Scenes } from "telegraf"
import { Person, Task } from "./models"
interface MyWizardSession extends Scenes.WizardSessionData {
	new_task: Task
    members: {
		[key: string]: Person
	}
    bandMember: String
    idGroup:Number
    idArea:Number
}

export type customWizardContext = Scenes.WizardContext<MyWizardSession>;
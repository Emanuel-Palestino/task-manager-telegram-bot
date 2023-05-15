import { Scenes } from 'telegraf'
import { Person, Task } from './models'

interface MyWizardSession extends Scenes.WizardSessionData {
    new_task: Task
    members: Person[]
    bandMember: string
    idArea: string
    date: String
    messageAfterDate: string
}

export type customWizardContext = Scenes.WizardContext<MyWizardSession>
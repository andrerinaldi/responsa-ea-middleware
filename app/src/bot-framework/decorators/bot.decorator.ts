import { Option } from '@responsa/responsa/types/responsa'
import { Activity } from 'botbuilder-core'

export interface BotDecorator {
  decorate: (msg: Partial<Activity>, opts: Option[]) => void
}

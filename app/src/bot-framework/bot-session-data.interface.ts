import { Choices } from '../../libs/responsa/src/types/responsa'

export interface BotSessionData {
  botId?: string
  conversationId?: string
  lastChoices?: Choices
}

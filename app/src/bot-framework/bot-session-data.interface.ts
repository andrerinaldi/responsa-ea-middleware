import { Choices } from '../../libs/responsa/src/types/responsa'

export enum BotMessageSender {
  BOT,
  USER,
  AGENT
}

export interface BotHistoryMessage {
  from: string
  when: Date
  text: string
}

export interface BotSessionData {
  botId?: string
  conversationId?: string
  arpaConversationId?: string
  lastChoices?: Choices
  history?: BotHistoryMessage[]
}

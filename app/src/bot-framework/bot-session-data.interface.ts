import { Choices } from '../../libs/responsa/src/types/responsa'
import { LiveChatStatus } from './arpa/types/live-chat-status'

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

export interface ArpaChat {
  id: string
  status: LiveChatStatus
}

export interface BotSessionData {
  botId?: string
  conversationId?: string
  arpa?: ArpaChat
  lastChoices?: Choices
  history?: BotHistoryMessage[]
}

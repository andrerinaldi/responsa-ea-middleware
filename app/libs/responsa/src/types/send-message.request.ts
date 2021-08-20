import { Choices } from './responsa'
export default interface SendMessageRequest {
  botId: string
  conversationId: string
  input: string | number
  lastChoices?: Choices
}

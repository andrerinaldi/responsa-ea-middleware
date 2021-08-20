export type Message = {
  speaker: string
  text: string
  feedback?: string
}

export type Option = {
  text: string
  description?: string
  payload: string
  image_url?: string
}

export type Choices = {
  type: string
  show_as?: string
  options?: Option[]
}

export type InputSettings = {
  type: string
}

export type ResponsaRequest =
  | Record<string, { payload: string }>
  | { text: string | undefined }
  | { user: string }

export default interface Responsa {
  botId: string
  conversation_id: string
  messages: Message[]
  choices?: Choices
  input_settings?: InputSettings
}

/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import {v4 as uuidv4} from 'uuid';
import AgentsAvailabilityResponse from './types/agents-availability.response'
import SendMessageResponse from './types/send-message.response';
import StartConversationResponse from './types/start-conversation.response'
import StartECEConversationResponse from './types/start-ece-conversation.response'

@Injectable()
export class ArpaService {
  private ENDPOINT: string
  private TOKEN: string
  private BOT_NAME: string

  // eslint-disable-next-line prettier/prettier
  constructor(private http: HttpService, private config: ConfigService) {
    this.ENDPOINT = this.config.get('ARPA_ENDPOINT')??''
    this.TOKEN = this.config.get('ARPA_TOKEN')??''
    this.BOT_NAME = this.config.get('ARPA_BOT_NAME')??''
  }

  async getAgentsAvailability(): Promise<AgentsAvailabilityResponse> {
    const result = this.http.get(`${this.ENDPOINT}/dapi/api/v1/chat-available-agents/${this.BOT_NAME}/`, {
      headers: {
        'Authorization': `Token ${this.TOKEN}`
      }
    })

    try {
      const { status, data, statusText } = await firstValueFrom(result)
      if (status < 200 || status > 299) {
        throw new Error(statusText)
      }
      return data
    } catch (err) {
      throw err
    }
  }

  async startConversation(conversationId: string): Promise<StartConversationResponse> {
    const uuid = uuidv4()
    const result = this.http.post(`${this.ENDPOINT}/dapi/v1/conversation/`, {
      conversation_id: conversationId,
      pf_id: uuid
    }, {
      headers: {
        'Authorization': `Token ${this.TOKEN}`
      }
    })

    try {
      const { status, data, statusText } = await firstValueFrom(result)
      if (status < 200 || status > 299) {
        throw new Error(statusText)
      }
      return data
    } catch (err) {
      // todo - handle errors correctly
      console.log(err.response.data)
      throw err
    }
  }

  async startECEConversation(conversationId: string): Promise<StartECEConversationResponse> {
    const result = this.http.post(`${this.ENDPOINT}/dapi/v1/start-ece-conversation/`, {
      conversation: conversationId,
      bot_name: this.BOT_NAME,
      phone_number: '3333333333'
    }, {
      headers: {
        'Authorization': `Token ${this.TOKEN}`
      }
    })

    try {
      const { status, data, statusText } = await firstValueFrom(result)
      if (status < 200 || status > 299) {
        throw new Error(statusText)
      }
      return data
    } catch (err) {
      // todo - handle errors correctly
      console.log(err.response.data)
      throw err
    }
  }

  async sendMessage(conversationId: string, msg: string): Promise<SendMessageResponse> {
    const result = this.http.post(`${this.ENDPOINT}/dapi/v1/send-ece-message/`, {
      conversation: conversationId,
      text: msg
    }, {
      headers: {
        'Authorization': `Token ${this.TOKEN}`
      }
    })

    try {
      const { status, data, statusText } = await firstValueFrom(result)
      if (status < 200 || status > 299) {
        throw new Error(statusText)
      }
      return data
    } catch (err) {
      throw err
    }
  }
}

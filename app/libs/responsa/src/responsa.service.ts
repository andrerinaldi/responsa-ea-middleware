/* eslint-disable prettier/prettier */
import * as FormData from 'form-data'
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import Responsa, { ResponsaRequest } from './types/responsa'
import SendMessageRequest from './types/send-message.request'
import { ResponsaRequestBuilder } from './builders/responsa-request-builder'

@Injectable()
export class ResponsaService {
  private RESPONSA_CHATBOT_URL: string
  private RESPONSA_USER: string

  // eslint-disable-next-line prettier/prettier
  constructor(private http: HttpService, private config: ConfigService, private readonly reqBuilder: ResponsaRequestBuilder) {
    this.RESPONSA_CHATBOT_URL = this.config.get('RESPONSA_CHATBOT_URL')??''
    this.RESPONSA_USER = this.config.get('RESPONSA_USER')??''
  }

  async initConversation(botId: string): Promise<Responsa> {
    return await this.postToResponsa(
      `${this.RESPONSA_CHATBOT_URL}/api/v3/chatbot/${botId}/conversation`,
      {
        user: this.RESPONSA_USER
      }
    )
  }

  async answer(req: SendMessageRequest): Promise<Responsa> {
    const payload = this.reqBuilder.buildFrom(req)
    return await this.postToResponsa(
      `${this.RESPONSA_CHATBOT_URL}/api/v3/chatbot/${req.botId}/conversation/${req.conversationId}/message`,
      payload
    )
  }

  public async uploadImageToResponsa(
    botId: string,
    conversationId: string,
    formData: FormData
  ): Promise<Responsa> {
    const result = this.http.post(`${this.RESPONSA_CHATBOT_URL}/api/v3/chatbot/${botId}/conversation/${conversationId}/message`, formData, {
      headers: {
        'Conversation-Type': 'auto',
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'Content-Length': `${formData.getLengthSync()}`
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

  private async postToResponsa(
    url: string,
    payload: ResponsaRequest
  ): Promise<Responsa> {
    const result = this.http.post(url, payload, {
      headers: {
        'Conversation-Type': 'auto'
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

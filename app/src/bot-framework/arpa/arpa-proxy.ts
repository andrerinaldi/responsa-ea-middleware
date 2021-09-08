/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common'
import { SessionStorageService } from 'src/session-storage';
import { BotSessionData } from '../bot-session-data.interface';
import { ArpaService } from './arpa.service';

@Injectable()
export class ArpaProxy {

  constructor(private readonly sessionStorage: SessionStorageService, private readonly service: ArpaService) {
  }

  async hasAvailableAgents(): Promise<boolean> {
    const res = await this.service.getAgentsAvailability()
    const agents = parseInt(res.availableAgents)
    return agents > 0
  }

  async startConversation(conversationId: string): Promise<boolean> {
    const res1 = await this.service.startConversation(conversationId)
    if (res1.conversation_id === conversationId && !res1.expired) {
    const res2 = await this.service.startECEConversation(conversationId)
      const started = res2.conversation === conversationId && res2.ece_initialized
      if (started) {
        await this.sessionStorage.update<BotSessionData>(
          conversationId,
          {
            arpaConversationId: res2.guid
          }
        )
      }

      return started
    } 
    return false
  }

  async sendMessage(conversationId: string, msg: string): Promise<boolean> {
    const res = await this.service.sendMessage(conversationId, msg)
    return res.direction === 1 && res.text === msg
  }
}

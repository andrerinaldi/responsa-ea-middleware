import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ResponsaService } from '@responsa/responsa'
import { TurnContext } from 'botbuilder-core'
import { Activity } from 'botframework-schema'
import { SessionStorageService } from '../../session-storage'
import { ArpaProxy } from '../arpa/arpa-proxy'
import { LiveChatStatus } from '../arpa/types/live-chat-status'
import { BotSessionData } from '../bot-session-data.interface'
import { BotMessageRoute } from './bot.message.route'
import { BotMessageRouteResult } from './bot.message.route.result'

@Injectable()
export class BotMessageRouteArpa extends BotMessageRoute {
  constructor(
    config: ConfigService,
    sessionStore: SessionStorageService,
    responsa: ResponsaService,
    private readonly arpa: ArpaProxy
  ) {
    super(config, sessionStore, responsa)
  }

  async receive(c: TurnContext, a: Activity): Promise<BotMessageRouteResult> {
    const result = {
      accomplished: false
    }

    const bfID = a.conversation.id
    const s = await this.sessionStore.get<BotSessionData>(bfID)
    if (s) {
      if (s.arpa?.id) {
        const status = this.getLiveChatStatus(a)
        if (
          status === LiveChatStatus.UNAVAILABLE ||
          status === LiveChatStatus.CLOSED
        ) {
          const res = await this.arpa.closeConversation(bfID, status)
        } else {
          await this.arpa.sendMessage(bfID, a.text)
          result.accomplished = true
        }
      } else {
        const hasAgents = await this.arpa.hasAvailableAgents()
        if (hasAgents) {
          const started = await this.arpa.startConversation(bfID)
          if (started) {
            await this.arpa.sendMessage(bfID, 'holaaaaa')
            result.accomplished = true
          }
        }
      }
    }

    return result
  }

  private getLiveChatStatus(a: Activity): LiveChatStatus {
    if (a.channelData.proxyTo === 'callmeback')
      return LiveChatStatus.UNAVAILABLE
    if (
      a.channelData.proxyTo === 'closed' ||
      a.channelData.proxyTo === 'conversationComplete'
    )
      return LiveChatStatus.CLOSED
    return LiveChatStatus.OPEN
  }
}

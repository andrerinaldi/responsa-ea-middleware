import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ResponsaService } from '@responsa/responsa'
import { TurnContext } from 'botbuilder-core'
import { Activity } from 'botframework-schema'
import { SessionStorageService } from '../../session-storage'
import { ArpaProxy } from '../arpa/arpa-proxy'
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
      if (s.arpaConversationId) {
        await this.arpa.sendMessage(bfID, a.text)
        result.accomplished = true
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
}

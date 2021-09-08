import { ConfigService } from '@nestjs/config'
import { ResponsaService } from '@responsa/responsa'
import { Activity, TurnContext } from 'botbuilder'
import { SessionStorageService } from 'src/session-storage'
import { BotMessageRouteResult } from './bot.message.route.result'

export abstract class BotMessageRoute {
  constructor(
    protected readonly config: ConfigService,
    protected readonly sessionStore: SessionStorageService,
    protected readonly responsa: ResponsaService
  ) {}

  abstract receive(c: TurnContext, a: Activity): Promise<BotMessageRouteResult>
}

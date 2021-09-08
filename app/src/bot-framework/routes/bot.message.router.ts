import { Injectable, OnModuleInit } from '@nestjs/common'
import { Activity, ActivityFactory, ActivityTypes } from 'botbuilder'
import { BotMessageRoute } from './bot.message.route'
import { BotMessageRouteArpa } from './bot.message.route.arpa'
import { BotMessageRouteResponsa } from './bot.message.route.responsa'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class BotMessageRouter implements OnModuleInit {
  defaultRoute!: BotMessageRoute

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.defaultRoute = this.moduleRef.get(BotMessageRouteResponsa)
  }

  route(a: Activity): BotMessageRoute {
    console.log(this.constructor.name)
    if (a.type === ActivityTypes.ConversationUpdate) {
      return this.defaultRoute
    }

    const shouldEscalate = a.text === 'Acquisto'
    const isInEscalation =
      a.channelId === 'directline' && a.channelData && a.channelData.proxyTo
    if (shouldEscalate || isInEscalation) {
      return this.moduleRef.get(BotMessageRouteArpa)
    } else {
      return this.defaultRoute
    }
  }
}

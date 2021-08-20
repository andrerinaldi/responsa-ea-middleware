import { Injectable } from '@nestjs/common'
import { Channels } from 'botbuilder-core'
import { BotDecorator } from './bot.decorator'
import { BotDecoratorCarousel } from './bot.decorator.carousel'
import { BotDecoratorQuickReply } from './bot.decorator.quickreply'
import { BotDecoratorQuickReplyMsTeams } from './bot.decorator.quickreply.msteams'

@Injectable()
export class BotDecoratorFactory {
  get(type?: string, channelId?: string): BotDecorator {
    if (type === 'carousel') {
      return new BotDecoratorCarousel()
    }

    if (channelId === Channels.Msteams) {
      return new BotDecoratorQuickReplyMsTeams()
    }

    return new BotDecoratorQuickReply()
  }
}

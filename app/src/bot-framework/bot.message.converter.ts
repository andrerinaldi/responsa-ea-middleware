import { Injectable } from '@nestjs/common'
import Responsa from '@responsa/responsa/types/responsa'
import { Activity, MessageFactory } from 'botbuilder-core'
import { BotDecoratorFactory } from './decorators/bot.decorator.factory'

@Injectable()
export class BotMessagesConverter {
  constructor(private readonly f: BotDecoratorFactory) {}

  public fromResponsa(
    channelId: string,
    data: Responsa
  ): Array<Partial<Activity>> {
    const activities = new Array<Partial<Activity>>()

    const { messages, choices } = data
    messages.forEach(({ text }) => {
      activities.push(MessageFactory.text(text))
    })

    if (choices != null && choices.options && choices.options.length > 0) {
      const opts = choices.options
      let optsMsg = activities.pop()
      if (!optsMsg) {
        optsMsg = MessageFactory.text('')
      }

      const decorator = this.f.get(choices.show_as, channelId)
      decorator.decorate(optsMsg, opts)

      activities.push(optsMsg)
    }

    return activities
  }
}

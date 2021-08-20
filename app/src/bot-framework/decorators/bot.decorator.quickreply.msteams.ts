import { Option } from '@responsa/responsa/types/responsa'
import { AttachmentLayoutTypes } from 'botbuilder'
import {
  Activity,
  ActionTypes,
  CardFactory,
  CardAction,
  InputHints
} from 'botbuilder-core'
import { BotDecorator } from './bot.decorator'

export class BotDecoratorQuickReplyMsTeams implements BotDecorator {
  decorate(msg: Partial<Activity>, opts: Option[]) {
    const actions = new Array<CardAction>()

    opts.forEach((o) => {
      actions.push({
        type: ActionTypes.ImBack,
        title: o.text,
        displayText: o.text,
        value: o.text
      })
    })

    msg.inputHint = InputHints.IgnoringInput
    msg.attachmentLayout = AttachmentLayoutTypes.List
    msg.attachments = [CardFactory.heroCard('', [], actions)]
  }
}

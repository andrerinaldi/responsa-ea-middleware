import { Option } from '@responsa/responsa/types/responsa'
import {
  Activity,
  ActionTypes,
  CardAction,
  InputHints,
  SuggestedActions
} from 'botframework-schema'
import { BotDecorator } from './bot.decorator'

export class BotDecoratorQuickReply implements BotDecorator {
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
    msg.suggestedActions = <SuggestedActions>{ actions }
  }
}

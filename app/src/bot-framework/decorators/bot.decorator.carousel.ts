import { Option } from '@responsa/responsa/types/responsa'
import {
  Activity,
  Attachment,
  AttachmentLayoutTypes,
  CardFactory,
  InputHints
} from 'botbuilder-core'
import { BotDecorator } from './bot.decorator'

export class BotDecoratorCarousel implements BotDecorator {
  decorate(msg: Partial<Activity>, opts: Option[]) {
    const attachments = new Array<Attachment>()
    opts.forEach((o) => {
      attachments.push(
        CardFactory.heroCard(
          o.text,
          o.image_url ? CardFactory.images([o.image_url]) : [],
          CardFactory.actions([
            { title: 'Seleziona', type: 'imBack', value: o.text }
          ])
        )
      )
    })

    msg.inputHint = InputHints.IgnoringInput
    msg.attachmentLayout = AttachmentLayoutTypes.Carousel
    msg.attachments = attachments
  }
}

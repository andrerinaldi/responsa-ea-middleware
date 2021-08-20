import { BotDecoratorCarousel } from './bot.decorator.carousel'
import { Option } from '@responsa/responsa/types/responsa'
import {
  Activity,
  AttachmentLayoutTypes,
  InputHints,
  MessageFactory
} from 'botbuilder-core'

describe('BotDecoratorCarousel', () => {
  const sut = new BotDecoratorCarousel()
  const validateCarousel = (msg: Partial<Activity>) => {
    expect(msg).toBeTruthy()
    expect(msg.text).toEqual('ciao')
    expect(msg.inputHint).toEqual(InputHints.IgnoringInput)
    expect(msg.suggestedActions).toBeUndefined()
    expect(msg.attachmentLayout).toEqual(AttachmentLayoutTypes.Carousel)
    expect(msg.attachments).toBeTruthy()
  }

  it('decorates a carousel with proper items', () => {
    const actual = MessageFactory.text('ciao')
    const opts: Option[] = [
      {
        text: 'test1',
        payload: 'test1 payload',
        description: 'test1 desc',
        image_url: 'test1 url'
      },
      {
        text: 'test2',
        payload: 'test2 payload',
        description: 'test2 desc'
      }
    ]
    sut.decorate(actual, opts)

    validateCarousel(actual)

    expect(actual.attachments).toHaveLength(2)
    if (actual.attachments) {
      expect(actual.attachments[0].contentType).toEqual(
        'application/vnd.microsoft.card.hero'
      )
      expect(actual.attachments[0].content).toBeTruthy()
      expect(actual.attachments[0].content.images).toHaveLength(1)
      expect(actual.attachments[1].contentType).toEqual(
        'application/vnd.microsoft.card.hero'
      )
      expect(actual.attachments[1].content).toBeTruthy()
      expect(actual.attachments[1].content.images).toHaveLength(0)
    }
  })

  it('decorates a carousel with no options in input', () => {
    const actual = MessageFactory.text('ciao')
    const opts: Option[] = []
    sut.decorate(actual, opts)

    validateCarousel(actual)

    expect(actual.attachments).toHaveLength(0)
  })
})

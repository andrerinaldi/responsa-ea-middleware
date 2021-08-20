import { BotDecoratorQuickReply } from './bot.decorator.quickreply'
import { Option } from '@responsa/responsa/types/responsa'
import { Activity, InputHints, MessageFactory } from 'botbuilder-core'

describe('BotDecoratorQuickReply', () => {
  const sut = new BotDecoratorQuickReply()
  const validate = (msg: Partial<Activity>) => {
    expect(msg).toBeTruthy()
    expect(msg.text).toEqual('ciao')
    expect(msg.inputHint).toEqual(InputHints.IgnoringInput)
    expect(msg.attachments).not.toBeTruthy()
    expect(msg.attachmentLayout).not.toBeTruthy()
    expect(msg.suggestedActions).toBeTruthy()
    if (msg.suggestedActions) {
      expect(msg.suggestedActions.actions).toBeTruthy()
    }
  }

  it('decorates quick replies with proper items', () => {
    const actual = MessageFactory.text('ciao')
    const opts: Option[] = [
      { text: 'test1', payload: 'test1 payload' },
      { text: 'test2', payload: 'test2 payload' }
    ]
    sut.decorate(actual, opts)

    validate(actual)

    if (actual.suggestedActions) {
      expect(actual.suggestedActions.actions).toHaveLength(2)
      expect(actual.suggestedActions.actions[0].title).toEqual('test1')
      expect(actual.suggestedActions.actions[1].title).toEqual('test2')
      expect(actual.suggestedActions.actions[0].displayText).toEqual('test1')
      expect(actual.suggestedActions.actions[1].displayText).toEqual('test2')
      expect(actual.suggestedActions.actions[0].value).toEqual('test1')
      expect(actual.suggestedActions.actions[1].value).toEqual('test2')
    }
  })

  it('decorates a carousel with no options in input', () => {
    const actual = MessageFactory.text('ciao')
    const opts: Option[] = []
    sut.decorate(actual, opts)

    validate(actual)

    if (actual.suggestedActions) {
      expect(actual.suggestedActions.actions).toHaveLength(0)
    }
  })
})

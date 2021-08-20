import { Test, TestingModule } from '@nestjs/testing'
import { ResponsaModule } from '@responsa/responsa'
import { BootstrapModule } from './../../bootstrap.module'
import { SessionStorageModule } from './../../session-storage'
import { BotModule } from '../bot.module'
import { BotDecoratorCarousel } from './bot.decorator.carousel'
import { BotDecoratorFactory } from './bot.decorator.factory'
import { BotDecoratorQuickReply } from './bot.decorator.quickreply'
import { BotDecoratorQuickReplyMsTeams } from './bot.decorator.quickreply.msteams'

describe('BotDecoratorFactory', () => {
  let sut: BotDecoratorFactory

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        BootstrapModule,
        SessionStorageModule,
        ResponsaModule,
        BotModule
      ]
    }).compile()
    sut = moduleRef.get<BotDecoratorFactory>(BotDecoratorFactory)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should return carousel decorator with "carousel"', () => {
    const actual = sut.get('carousel')
    expect(actual).toBeInstanceOf(BotDecoratorCarousel)
  })

  it('should return quick reply decorator with "buttons"', () => {
    const actual = sut.get('quick_reply')
    expect(actual).toBeInstanceOf(BotDecoratorQuickReply)
  })

  it('should return quick reply decorator with "quick_reply"', () => {
    const actual = sut.get('quick_reply')
    expect(actual).toBeInstanceOf(BotDecoratorQuickReply)
  })

  it('should return quick reply decorator with null', () => {
    const actual = sut.get(undefined)
    expect(actual).toBeInstanceOf(BotDecoratorQuickReply)
  })

  it('should return MS Teams quick reply decorator with "buttons" and teams channelID', () => {
    const actual = sut.get('quick_reply', 'msteams')
    expect(actual).toBeInstanceOf(BotDecoratorQuickReplyMsTeams)
  })

  it('should return quick reply decorator with empty string', () => {
    const actual = sut.get('')
    expect(actual).toBeInstanceOf(BotDecoratorQuickReply)
  })
})

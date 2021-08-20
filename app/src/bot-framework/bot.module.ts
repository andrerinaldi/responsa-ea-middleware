import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ResponsaModule } from '@responsa/responsa'
import { SessionStorageModule } from '../session-storage'
import { BotMessageAdapter } from './bot.message.adapter'
import { BotController } from './bot.controller'
import { BotMessagesConverter } from './bot.message.converter'
import { BotMessagesHandler } from './bot.message.handler'
import { BotDecoratorFactory } from './decorators/bot.decorator.factory'

@Module({
  imports: [ResponsaModule, ConfigModule, SessionStorageModule],
  controllers: [BotController],
  providers: [
    BotMessageAdapter,
    BotMessagesHandler,
    BotMessagesConverter,
    BotDecoratorFactory
  ]
})
export class BotModule {}

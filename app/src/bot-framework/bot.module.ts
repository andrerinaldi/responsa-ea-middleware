import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ResponsaModule } from '@responsa/responsa'
import { SessionStorageModule } from '../session-storage'
import { BotMessageAdapter } from './bot.message.adapter'
import { BotController } from './bot.controller'
import { BotMessagesConverter } from './bot.message.converter'
import { BotMessagesHandler } from './bot.message.handler'
import { BotDecoratorFactory } from './decorators/bot.decorator.factory'
import { BotMessageRouter } from './routes/bot.message.router'
import { BotMessageRouteResponsa } from './routes/bot.message.route.responsa'
import { BotMessageRouteArpa } from './routes/bot.message.route.arpa'
import { LoggerModule } from 'nestjs-pino'
import { ArpaService } from './arpa/arpa.service'
import { HttpModule } from '@nestjs/axios'
import { ArpaProxy } from './arpa/arpa-proxy'

@Module({
  imports: [
    ResponsaModule,
    ConfigModule,
    SessionStorageModule,
    HttpModule,
    LoggerModule.forRoot()
  ],
  controllers: [BotController],
  providers: [
    BotMessageAdapter,
    BotMessagesHandler,
    BotMessagesConverter,
    BotDecoratorFactory,
    BotMessageRouter,
    BotMessageRouteResponsa,
    BotMessageRouteArpa,
    ArpaService,
    ArpaProxy
  ]
})
export class BotModule {}

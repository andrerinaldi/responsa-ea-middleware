import { Module } from '@nestjs/common'
import { ResponsaModule } from '@responsa/responsa'
import { BootstrapModule } from './bootstrap.module'
import { BotModule } from './bot-framework/bot.module'
import { SessionStorageModule } from './session-storage/session-storage.module'
import { StatusController } from './status/status.controller'

@Module({
  imports: [
    BootstrapModule,
    SessionStorageModule,
    ResponsaModule,
    BotModule
  ],
  exports: [],
  controllers: [StatusController],
})
export class AppModule {}

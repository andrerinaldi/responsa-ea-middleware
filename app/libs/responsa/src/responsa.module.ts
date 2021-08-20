import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ResponsaRequestBuilder } from './builders/responsa-request-builder'
import { ResponsaService } from './responsa.service'

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ResponsaService, ResponsaRequestBuilder],
  exports: [ResponsaService]
})
export class ResponsaModule {}

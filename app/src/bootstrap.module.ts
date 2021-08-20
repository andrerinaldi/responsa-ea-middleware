import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { join } from 'path'
import appConfig from './config/app.config'
import mongoConfig from './config/mongo.config'
import statusConfig from './config/status.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [statusConfig, appConfig, mongoConfig],
      isGlobal: true
    }),
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('mongo.URI')
        const database = config.get<string>('mongo.DATABASE')
        if (!uri) throw new Error('mongo.URI not found')
        if (!database) throw new Error('mongo.DATABASE not found')
        return {
          uri,
          dbName: database
        }
      },
      inject: [ConfigService]
    })
  ],
  exports: [HttpModule],
  controllers: [],
  providers: []
})
export class BootstrapModule {}

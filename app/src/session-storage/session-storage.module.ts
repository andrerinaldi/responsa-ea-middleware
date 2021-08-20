import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SessionEntity, SessionSchema } from './entities/session.entity'
import { SessionStorageService } from './services/session-storage.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionEntity.name, schema: SessionSchema }
    ])
  ],
  providers: [SessionStorageService],
  exports: [SessionStorageService]
})
export class SessionStorageModule {}

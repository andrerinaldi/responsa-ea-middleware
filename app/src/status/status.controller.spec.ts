import { Test, TestingModule } from '@nestjs/testing'
import { StatusController } from './status.controller'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import statusConfig from '../config/status.config'

describe('StatusController', () => {
  let app: INestApplication
  let controller: StatusController
  let configs: ConfigService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [statusConfig]
        })
      ],
      controllers: [StatusController]
    }).compile()

    controller = moduleRef.get<StatusController>(StatusController)
    configs = moduleRef.get<ConfigService>(ConfigService)
    app = moduleRef.createNestApplication()
    await app.init()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return up', async () => {
    const CI_PUTS_HERE_LAST_GIT_COMMIT = configs.get('status.lastGitCommit')
    const CI_PUTS_HERE_DEPLOY_DATE = configs.get('status.deployDate')
    await request(app.getHttpServer())
      .get('/status')
      .expect(200)
      .expect(
        `ok! Responsa Twilio Middleware released on ${CI_PUTS_HERE_DEPLOY_DATE}, last commit was "${CI_PUTS_HERE_LAST_GIT_COMMIT}"`
      )
  })
})

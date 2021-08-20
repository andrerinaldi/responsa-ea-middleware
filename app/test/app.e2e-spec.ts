import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { I18nService } from 'nestjs-i18n'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let i18n: I18nService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    i18n = moduleRef.get<I18nService>(I18nService)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/status (GET)', () => {
    return request(app.getHttpServer()).get('/status').expect(200).expect(/ok/)
  })

  it('/voice (POST)', async () => {
    const helloMessage = await i18n.t('demo.HELLO')
    return request(app.getHttpServer())
      .post('/voice')
      .expect(200)
      .expect(new RegExp(helloMessage))
  })

  it('/voice/60efe4ffe64cfa29561b2c94 (POST)', async () => {
    return request(app.getHttpServer())
      .post('/voice/60efe4ffe64cfa29561b2c94')
      .expect(200)
      .expect(
        /Gentile cliente, benvenuto al servizio di assistenza virtuale Douglas./
      )
  })
})

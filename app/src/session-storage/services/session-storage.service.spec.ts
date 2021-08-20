import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { SessionStorageService } from './session-storage.service'

describe('SessionService', () => {
  let session: SessionStorageService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    session = moduleRef.get<SessionStorageService>(SessionStorageService)
    await moduleRef.createNestApplication().init()
  })

  afterAll(async () => {
    await session.clear()
  })

  it('create session', async () => {
    await session.create<{ test: string }>({
      id: 'test',
      test: 'prova'
    })
    const ourSession = await session.get<{ test: string }>('test')
    expect(ourSession).toBeDefined()
  })

  it('create session with right data', async () => {
    await session.create<{ test: string }>({
      id: 'test',
      test: 'prova'
    })
    const ourSession = await session.get<{ test: string }>('test')
    expect(ourSession).toHaveProperty('test', 'prova')
  })
})

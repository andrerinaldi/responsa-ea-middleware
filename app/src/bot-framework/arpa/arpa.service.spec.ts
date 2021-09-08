import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module'
import { ArpaService } from './arpa.service'

describe('ArpaService', () => {
  let sut: ArpaService
  const bfConversationId = 'D18qtMgy1pp5ExU6FvwTm7-h'

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    sut = moduleRef.get<ArpaService>(ArpaService)
    await moduleRef.createNestApplication().init()
  })

  it('gets agents availability', async () => {
    const actual = await sut.getAgentsAvailability()
    expect(actual).toBeDefined()
    expect(actual.availableAgents).toBeTruthy()
    const agents = parseInt(actual.availableAgents)
    expect(agents).toBeGreaterThan(-1)
  }, 15000)

  it('starts conversation', async () => {
    const actual = await sut.startConversation(bfConversationId)
    expect(actual).toBeDefined()
    expect(actual.conversation_id).toBeDefined()
    expect(actual.conversation_id).toEqual(bfConversationId)
    expect(actual.pf_id).toBeDefined()
    expect(actual.pf_id).toBeTruthy()
    expect(actual.expired).toBeDefined()
    expect(actual.expired).toEqual(false)
  }, 15000)

  it('starts ECE conversation', async () => {
    const actual = await sut.startECEConversation(bfConversationId)
    expect(actual).toBeDefined()
    expect(actual.conversation).toBeDefined()
    expect(actual.conversation).toEqual(bfConversationId)
    expect(actual.guid).toBeDefined()
    expect(actual.guid).toBeTruthy()
    expect(actual.is_transfer).toBeDefined()
    expect(actual.is_transfer).toEqual(true)
    expect(actual.ece_initialized).toBeDefined()
    expect(actual.ece_initialized).toEqual(true)
  }, 15000)

  it('sends ECE message', async () => {
    const expectedMsg = 'saluto di test'
    const actual = await sut.sendMessage(bfConversationId, expectedMsg)
    expect(actual).toBeDefined()
    expect(actual.id).toBeDefined()
    expect(actual.id).toBeTruthy()
    expect(actual.chat_conversation).toBeDefined()
    expect(actual.chat_conversation).toBeTruthy()
    expect(actual.text).toBeDefined()
    expect(actual.text).toEqual(expectedMsg)
    expect(actual.direction).toBeDefined()
    expect(actual.direction).toEqual(1)
  }, 15000)
})

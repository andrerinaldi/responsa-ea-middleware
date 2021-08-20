import { ResponsaRequest } from '../types/responsa'
import { ResponsaRequestBuilder } from './responsa-request-builder'

describe('ResponsaRequestBuilder', () => {
  it('builds simple textual request', () => {
    const sut = new ResponsaRequestBuilder()
    const actual: ResponsaRequest = sut.buildFrom({
      botId: 'testbotid',
      conversationId: 'convid',
      input: 'testvalue'
    })

    expect(actual).toBeDefined()
    expect((actual as { text: string | undefined }).text).toEqual('testvalue')
  })

  it('builds request from matching choices', () => {
    const sut = new ResponsaRequestBuilder()
    const actual: ResponsaRequest = sut.buildFrom({
      botId: 'testbotid',
      conversationId: 'convid',
      input: 1,
      lastChoices: {
        type: 'testtype',
        options: [{ text: 'text', payload: 'payload' }]
      }
    })

    expect(actual).toBeDefined()
    const actualReq = actual as Record<string, { payload: string }>
    expect(actualReq.testtype).toBeDefined()
    expect(actualReq.testtype.payload).toEqual('payload')
  })

  it('builds request from choices matching with input', () => {
    const sut = new ResponsaRequestBuilder()
    const actual: ResponsaRequest = sut.buildFrom({
      botId: 'testbotid',
      conversationId: 'convid',
      input: 'text',
      lastChoices: {
        type: 'testtype',
        options: [{ text: 'text', payload: 'payload' }]
      }
    })

    expect(actual).toBeDefined()
    const actualReq = actual as Record<string, { payload: string }>
    expect(actualReq.testtype).toBeDefined()
    expect(actualReq.testtype.payload).toEqual('payload')
  })

  it('builds simple textual request from not matching choices', () => {
    const sut = new ResponsaRequestBuilder()
    const actual: ResponsaRequest = sut.buildFrom({
      botId: 'testbotid',
      conversationId: 'convid',
      input: 2,
      lastChoices: {
        type: 'testtype',
        options: [{ text: 'text', payload: 'payload' }]
      }
    })

    expect(actual).toBeDefined()
    expect((actual as { text: string | undefined }).text).toEqual('2')
  })
})

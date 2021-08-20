import * as FormData from 'form-data'
import { HttpModule, HttpService } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { of } from 'rxjs'
import { ResponsaService } from './responsa.service'
import { ResponsaRequestBuilder } from './builders/responsa-request-builder'

describe('ResponsaService', () => {
  let service: ResponsaService
  let http: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [ResponsaService, ResponsaRequestBuilder]
    }).compile()
    const app = module.createNestApplication()
    await app.init()
    http = module.get<HttpService>(HttpService)
    service = module.get<ResponsaService>(ResponsaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('conversation', () => {
    it('init conversation with success', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: { conversation_id: 'conversation_id_test' },
        headers: [],
        config: {}
      }
      jest.spyOn(http, 'post').mockReturnValue(of(httpResult))
      const result = await service.initConversation('5cdd6734e64cfa74451d861d')
      expect(result).toBeDefined()
      expect(result.conversation_id).toEqual('conversation_id_test')
    })

    it('init conversation with error', async () => {
      const httpResult = {
        status: 500,
        statusText: 'fail',
        data: '',
        headers: [],
        config: {}
      }
      jest.spyOn(http, 'post').mockReturnValue(of(httpResult))
      let error
      try {
        await service.initConversation('5cdd6734e64cfa74451d861d')
      } catch (err) {
        error = err
      }
      expect(error).toBeDefined()
      expect(error.message).toBe('fail')
    })

    it('answer conversation with text', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: { conversation_id: 'conversation_id_test2' },
        headers: [],
        config: {}
      }
      const postToResponsa = jest
        .spyOn(http, 'post')
        .mockReturnValue(of(httpResult))
      const result = await service.answer({
        botId: '5cdd6734e64cfa74451d861d',
        conversationId: 'test',
        input: 'test text'
      })
      expect(result).toBeDefined()
      expect(result.conversation_id).toEqual('conversation_id_test2')
      expect(postToResponsa).toBeCalledWith(
        `https://chatbots-staging.goresponsa.com/api/v3/chatbot/5cdd6734e64cfa74451d861d/conversation/test/message`,
        { text: 'test text' },
        { headers: { 'Conversation-Type': 'auto' } }
      )
    })

    it('answer conversation with choice', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: { conversation_id: 'conversation_id_test2' },
        headers: [],
        config: {}
      }
      const postToResponsa = jest
        .spyOn(http, 'post')
        .mockReturnValue(of(httpResult))
      const result = await service.answer({
        botId: '5cdd6734e64cfa74451d861d',
        conversationId: 'test',
        input: 'test text',
        lastChoices: {
          type: 'choice',
          options: [{ text: 'test text', payload: 'test payload' }]
        }
      })
      expect(result).toBeDefined()
      expect(result.conversation_id).toEqual('conversation_id_test2')
      expect(postToResponsa).toBeCalledWith(
        `https://chatbots-staging.goresponsa.com/api/v3/chatbot/5cdd6734e64cfa74451d861d/conversation/test/message`,
        {
          choice: {
            payload: 'test payload'
          }
        },
        { headers: { 'Conversation-Type': 'auto' } }
      )
    })

    it('manage conversation with no options', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: { conversation_id: 'conversation_id_test2' },
        headers: [],
        config: {}
      }
      const postToResponsa = jest
        .spyOn(http, 'post')
        .mockReturnValue(of(httpResult))
      const result = await service.answer({
        botId: '5cdd6734e64cfa74451d861d',
        conversationId: 'test',
        input: 'test text',
        lastChoices: {
          type: 'test',
          options: undefined
        }
      })
      expect(result).toBeDefined()
      expect(result.conversation_id).toEqual('conversation_id_test2')
      expect(postToResponsa).toBeCalledWith(
        `https://chatbots-staging.goresponsa.com/api/v3/chatbot/5cdd6734e64cfa74451d861d/conversation/test/message`,
        { text: 'test text' },
        { headers: { 'Conversation-Type': 'auto' } }
      )
    })

    it('manage conversation with no choice found', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: { conversation_id: 'conversation_id_test2' },
        headers: [],
        config: {}
      }
      const postToResponsa = jest
        .spyOn(http, 'post')
        .mockReturnValue(of(httpResult))
      const result = await service.answer({
        botId: '5cdd6734e64cfa74451d861d',
        conversationId: 'test',
        input: 'test text',
        lastChoices: {
          type: 'test',
          options: [
            { text: 'another test text', payload: 'another test payload' }
          ]
        }
      })
      expect(result).toBeDefined()
      expect(result.conversation_id).toEqual('conversation_id_test2')
      expect(postToResponsa).toBeCalledWith(
        `https://chatbots-staging.goresponsa.com/api/v3/chatbot/5cdd6734e64cfa74451d861d/conversation/test/message`,
        { text: 'test text' },
        { headers: { 'Conversation-Type': 'auto' } }
      )
    })

    it('manage conversation with photo', async () => {
      const httpResult = {
        status: 200,
        statusText: 'success',
        data: {
          conversation_id: 'conversation_id_test2',
          input_settings: { type: 'file' }
        },
        headers: [],
        config: {}
      }

      const uploadImageToResponsa = jest
        .spyOn(http, 'post')
        .mockReturnValue(of(httpResult))

      const formData = new FormData()

      const responsaResult = await service.uploadImageToResponsa(
        '5cdd6734e64cfa74451d861d',
        'test',
        formData
      )

      expect(responsaResult).toBeDefined()
      expect(responsaResult.input_settings).toBeDefined()
      expect(responsaResult.input_settings).toEqual({ type: 'file' })
      expect(uploadImageToResponsa).toBeCalledWith(
        `https://chatbots-staging.goresponsa.com/api/v3/chatbot/5cdd6734e64cfa74451d861d/conversation/test/message`,
        formData,
        {
          headers: {
            'Conversation-Type': 'auto',
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            'Content-Length': `${formData.getLengthSync()}`
          }
        }
      )
    })
  })
})

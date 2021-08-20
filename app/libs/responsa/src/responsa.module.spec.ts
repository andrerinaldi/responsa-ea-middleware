import { Test, TestingModule } from '@nestjs/testing'
import { ResponsaRequestBuilder } from './builders/responsa-request-builder'
import { ResponsaModule } from './responsa.module'
import { ResponsaService } from './responsa.service'

describe('ResponsaModule', () => {
  it('ensures all providers are registered correctly', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ResponsaModule]
    }).compile()

    const service = module.get<ResponsaService>(ResponsaService)
    expect(service).toBeDefined()
    const builder = module.get<ResponsaRequestBuilder>(ResponsaRequestBuilder)
    expect(builder).toBeDefined()
  })
})

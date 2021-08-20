import { ResponsaRequestInputReader } from './responsa-request-input-reader'

describe('ResponsaRequestInputReader', () => {
  it('reads a string but not a number', () => {
    const sut = new ResponsaRequestInputReader('testvalue')
    const actualStr = sut.asString()
    const actualNmbr = sut.asNumber()
    expect(actualStr).toEqual('testvalue')
    expect(actualNmbr).toBeUndefined()
  })

  it('reads a number but not a string', () => {
    const sut = new ResponsaRequestInputReader(123)
    const actualStr = sut.asString()
    const actualNmbr = sut.asNumber()
    expect(actualNmbr).toEqual(123)
    expect(actualStr).toBeUndefined()
  })
})

import { Injectable } from '@nestjs/common'
import { ResponsaRequest } from '../types/responsa'
import SendMessageRequest from '../types/send-message.request'
import { ResponsaRequestInputReader } from '../utils/responsa-request-input-reader'

@Injectable()
export class ResponsaRequestBuilder {
  public buildFrom(req: SendMessageRequest): ResponsaRequest {
    const inputReader = new ResponsaRequestInputReader(req.input)
    const text = inputReader.asString()
    const digit = inputReader.asNumber()

    let payload: ResponsaRequest = { text: req.input.toString() }

    if (req.lastChoices && req.lastChoices.options?.length) {
      const selectedOption = req.lastChoices.options
        .filter((o) => o.text)
        .find((o, index) => {
          if (text)
            return o.text.toLocaleLowerCase() === text.toLocaleLowerCase()
          if (digit) return digit === index + 1
        })
      if (selectedOption) {
        payload = {
          [req.lastChoices.type]: {
            payload: selectedOption.payload
          }
        }
      }
    }

    return payload
  }
}

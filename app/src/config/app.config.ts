import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  repeatMessage: 'Non ho capito bene la risposta, puoi riprovare? '
}))

import { registerAs } from '@nestjs/config'

export default registerAs('mongo', () => ({
  URI:
    process.env.MONGO_URI ||
    'mongodb+srv://MuUungoletto:1S6C-AE8Jqy"yLPYaiG4t@muletto-di-responsa.qmyxx.mongodb.net',
  DATABASE: 'ea-middleware-dev'
}))

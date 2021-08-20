import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BotFrameworkAdapter, TurnContext } from 'botbuilder'
import { BotMessagesHandler } from './bot.message.handler'

@Injectable()
export class BotMessageAdapter {
  private adapter: BotFrameworkAdapter

  constructor(
    private handler: BotMessagesHandler,
    private config: ConfigService
  ) {
    this.adapter = new BotFrameworkAdapter({
      appId: this.config.get('BOT_FRAMEWORK_APP_ID'),
      appPassword: this.config.get('BOT_FRAMEWORK_APP_PASSWORD')
    })

    this.adapter.onTurnError = async (
      context: TurnContext,
      error: Error
    ): Promise<void> => {
      console.error(`\n [onTurnError] unhandled error: ${error}`)
    }
  }

  public async process(req: any, res: any) {
    this.adapter.processActivity(req, res, async (context: TurnContext) => {
      await this.handler.run(context)
    })
  }
}

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ResponsaService } from '@responsa/responsa'
import Responsa from '@responsa/responsa/types/responsa'
import { Activity, ActivityHandler, TurnContext } from 'botbuilder-core'
import { SessionStorageService } from '../session-storage'
import { Session } from '../session-storage/types'
import { BotSessionData } from './bot-session-data.interface'
import { BotMessagesConverter } from './bot.message.converter'

@Injectable()
export class BotMessagesHandler extends ActivityHandler {
  constructor(
    private readonly config: ConfigService,
    private readonly converter: BotMessagesConverter,
    private readonly responsa: ResponsaService,
    private readonly sessionStore: SessionStorageService
  ) {
    super()

    this.onMessage(async (context: TurnContext, next: () => Promise<void>) => {
      const activity = context.activity
      await context.sendActivity({ type: 'typing' })
      const session = await this.sessionStore.get<BotSessionData>(
        activity.conversation.id
      )
      if (session) {
        await this.continueConversation(context, session, activity)
      } else {
        await this.initConversation(context, activity)
      }
      next()
    })

    this.onConversationUpdate(
      async (context: TurnContext, next: () => Promise<void>) => {
        const activity = context.activity
        const shouldHandle =
          activity.membersAdded &&
          activity.membersAdded.some((m) => m.id === activity.recipient.id)
        if (shouldHandle) {
          const session = await this.sessionStore.get<BotSessionData>(
            activity.conversation.id
          )
          if (!session) {
            await context.sendActivity({ type: 'typing' })
            await this.initConversation(context, activity)
          }
        }

        next()
      }
    )
  }

  private async initConversation(context: TurnContext, data: Activity) {
    const id = data.conversation.id
    const botId = await this.config.get('RESPONSA_BOTID')
    const responsaResult = await this.responsa.initConversation(botId)
    const session = await this.sessionStore.create<BotSessionData>({
      botId,
      id,
      conversationId: responsaResult.conversation_id
    })
    await this.answer(context, session, responsaResult)
  }

  private async continueConversation(
    context: TurnContext,
    session: Session<BotSessionData>,
    data: Activity
  ) {
    if (!session.botId || !session.conversationId) {
      throw new Error('BOT_ID or CONVERSATION_ID missing from session')
    }

    let textToSend = data.text
    if (
      session.lastChoices &&
      session.lastChoices.options &&
      session.lastChoices.options.length > 0
    ) {
      session.lastChoices.options.forEach((o, i) => {
        if (textToSend === `${i + 1}`) textToSend = o.text
      })
    }

    if (textToSend) {
      const responsaResult = await this.responsa.answer({
        botId: session.botId,
        conversationId: session.conversationId,
        input: textToSend,
        lastChoices: session.lastChoices
      })

      await this.answer(context, session, responsaResult)
    }
  }

  private async answer(
    context: TurnContext,
    session: Session<BotSessionData>,
    responsaResult: Responsa
  ) {
    const response = this.converter.fromResponsa(
      context.activity.channelId,
      responsaResult
    )

    const hasChoices =
      responsaResult.choices != null &&
      responsaResult.choices.options &&
      responsaResult.choices.options.length > 0

    if (hasChoices) {
      await this.sessionStore.update<BotSessionData>(session.id, {
        lastChoices: responsaResult.choices
      })
    } else {
      await this.sessionStore.update<BotSessionData>(session.id, {
        lastChoices: undefined
      })
    }

    await context.sendActivities(response)
  }
}

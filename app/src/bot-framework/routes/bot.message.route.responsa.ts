import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ResponsaService } from '@responsa/responsa'
import { Activity, TurnContext } from 'botbuilder'
import { Session } from '../../session-storage/types'
import { SessionStorageService } from '../../session-storage'
import Responsa from '../../../libs/responsa/src/types/responsa'
import { BotSessionData } from '../bot-session-data.interface'
import { BotMessageRoute } from './bot.message.route'
import { BotMessageRouteResult } from './bot.message.route.result'
import { BotMessagesConverter } from '../bot.message.converter'

@Injectable()
export class BotMessageRouteResponsa extends BotMessageRoute {
  constructor(
    config: ConfigService,
    sessionStore: SessionStorageService,
    responsa: ResponsaService,
    private readonly converter: BotMessagesConverter
  ) {
    super(config, sessionStore, responsa)
  }

  async receive(c: TurnContext, a: Activity): Promise<BotMessageRouteResult> {
    console.log(this.constructor.name)
    const session = await this.sessionStore.get<BotSessionData>(
      a.conversation.id
    )
    if (session) {
      await c.sendActivity({ type: 'typing' })
      await this.continueConversation(c, session, a)
    } else {
      if (
        a.membersAdded &&
        a.membersAdded.some((m) => m.id === a.recipient.id)
      ) {
        await c.sendActivity({ type: 'typing' })
        await this.initConversation(c, a)
      }
    }

    return {
      accomplished: true
    }
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

    if (response.length > 0) {
      await context.sendActivities(response)
    }
  }
}

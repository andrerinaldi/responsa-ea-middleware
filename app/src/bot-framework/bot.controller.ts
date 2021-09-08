import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { BotMessageAdapter } from './bot.message.adapter'
import { Request, Response } from 'express'
import { Activity } from 'botbuilder'

@Controller('/api/messages')
export class BotController {
  constructor(private botConnector: BotMessageAdapter) {}

  @Post()
  async listen(@Req() request: Request, @Res() response: Response) {
    await this.botConnector.process(request, response)
  }
}

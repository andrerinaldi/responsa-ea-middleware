import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller('/status')
export class StatusController {
  constructor(private configs: ConfigService) {}

  @Get()
  status() {
    const lastDeploy = this.configs.get('status.deployDate')
    const lastCommit = this.configs.get('status.lastGitCommit')
    return `ok! Responsa Twilio Middleware released on ${lastDeploy}, last commit was "${lastCommit}"`
  }
}

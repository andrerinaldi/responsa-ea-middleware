import { registerAs } from '@nestjs/config'

export default registerAs('status', () => ({
  lastGitCommit: 'CI_PUTS_HERE_LAST_GIT_COMMIT',
  deployDate: 'CI_PUTS_HERE_DEPLOY_DATE'
}))

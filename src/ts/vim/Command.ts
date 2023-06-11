import { VIM } from '../main'
import cmdMap from './cmdMap'

export default class Command {
  private _command: string | null = null
  private static _hasError = false

  private static triggerError() {
    const COMMAND_HIDE_DELAY = 1000
    Command._hasError = true
    VIM.Statusline.update()
    setTimeout(() => {
      Command._hasError = false
      VIM.Statusline.update()
    }, COMMAND_HIDE_DELAY)
  }

  private map = new Map([
    ['w', () => cmdMap.write()],
    ['write', () => cmdMap.write()],
    ['q', () => cmdMap.quit()],
    ['quit', () => cmdMap.quit()],
    ['qa', () => cmdMap.quit()],
    ['wqa', () => cmdMap.quit()],
  ])

  private validateCommand(command: string) {
    command = command.slice(1)
    if (this.map.has(command)) return true
    return false
  }

  public static get status() {
    if (Command._hasError) {
      return 'Not an editor command'
    }
    return ''
  }

  public run() {
    if (this._command === null) return
    this.map.get(this._command)?.()
  }

  constructor(command: string) {
    if (!this.validateCommand(command)) {
      Command.triggerError()
      return
    }
    this._command = command.slice(1)
  }
}

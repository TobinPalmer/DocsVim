import { ErrorString } from '../types/docTypes'
import cmdMap from './cmdMap'
import Statusline from './Statusline'

export default class Command {
  private readonly _command: string | null = null
  private readonly map = new Map([
    ['w', () => cmdMap.write()],
    ['write', () => cmdMap.write()],
    ['q', () => cmdMap.quit()],
    ['quit', () => cmdMap.quit()],
    ['qa', () => cmdMap.quit()],
    ['wqa', () => cmdMap.quit()],
  ])

  constructor(command: string) {
    if (!this.validateCommand(command)) {
      Command.triggerError(command)
      return
    }
    this._command = command.slice(1)
  }

  public static createError(error: string): ErrorString {
    return `Not an editor command: ${error.substring(1)}` as ErrorString
  }

  public static showInfo(info: string) {
    Statusline.showMessage(info)
  }

  private static triggerError(command: string) {
    Statusline.showError(Command.createError(command))
  }

  public run() {
    if (this._command === null) return
    this.map.get(this._command)?.()
  }

  private validateCommand(command: string) {
    command = command.slice(1)
    return this.map.has(command)
  }
}

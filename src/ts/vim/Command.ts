import { VIM } from '../main'
import { ErrorString } from '../types/docTypes'
import cmdMap from './cmdMap'
import Statusline from './Statusline'

export default class Command {
  private _command: string | null = null
  private static _hasError = false

  public static createError(error: string): ErrorString {
    return `Not an editor command: ${error.substring(1)}` as ErrorString
  }

  public static showInfo(info: string) {
    console.log('Showing Info', info)
    Statusline.showMessage(info)
  }

  public static showError(error: string) {
    Statusline.showError(Command.createError(error))
  }

  private static triggerError(command: string) {
    // const COMMAND_HIDE_DELAY = 1000
    // Command._hasError = true
    // VIM.Statusline.update()
    // setTimeout(() => {
    //   Command._hasError = false
    //   VIM.Statusline.update()
    // }, COMMAND_HIDE_DELAY)
    Statusline.showError(Command.createError(command))
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
      Command.triggerError(command)
      return
    }
    this._command = command.slice(1)
  }
}
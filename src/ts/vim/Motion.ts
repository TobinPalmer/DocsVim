/* eslint-disable @typescript-eslint/no-explicit-any */
import { Keys } from '../input/FormatKey'
import { VIM } from '../main'
import { type KeyboardOpts, SpecialRegisters, VimBreakCodes, VimMode } from '../types/vimTypes'
import Command from './Command'
import { COMMAND_MAP } from './commandMap'

interface CommandMap {
  [key: string]: CommandMap | (() => void)
}

interface VimBreakCodesReturnType {
  code: VimBreakCodes
  required: number
}

export type needsAfterKeys = Partial<{
  status: boolean
  requiredKeys: number
}>

// Checks if a variable is a function
const isFunction = (fun: unknown): fun is (...args: any[]) => void => typeof fun === 'function'

export default class Motion {
  /** Keys that have been pressed in a sequence until a motion is found */
  private _afterKeys: { key: keyof Keys; opts: KeyboardOpts }[] = []
  private _currentKeys: { key: keyof Keys; opts: KeyboardOpts }[] = []
  private _repeat = ''
  private _needsAfterKeys: needsAfterKeys = { status: false, requiredKeys: 0 }
  private _originalOpts: KeyboardOpts = {}
  private readonly map: { [k: string]: any } = {}

  private _statusString: string[] = []

  public get statusString() {
    return this._statusString.join('')
  }

  private _commandKeys: string[] = []

  public get commandKeys() {
    if (this._commandKeys.length === 0) return ''

    return this._commandKeys.join('')
  }

  /** Feed a key to the Motion class */
  // eslint-disable-next-line complexity,max-statements
  public feedkey(originalKey: keyof Keys, opts: KeyboardOpts = {}): boolean {
    if (originalKey === ':') {
      VIM.Vim.mode = VimMode.COMMAND
      this._commandKeys.push(':')
      return false
    }
    if (VIM.Vim.mode === VimMode.COMMAND) {
      if (originalKey === 'Enter') {
        VIM.Vim.mode = VimMode.NORMAL
        const command = new Command(this.commandKeys)
        command.run()
        this._resetState()
        return false
      }
      if (originalKey === 'Escape') {
        VIM.Vim.mode = VimMode.NORMAL
        this._resetState()
        return false
      }
      if (originalKey === 'Backspace') {
        this._commandKeys.pop()
        VIM.Statusline.update()
        return false
      }
      this._commandKeys.push(originalKey)
      VIM.Statusline.update()
      return false
    }
    if (this._shouldRepeat(originalKey)) {
      this._repeat += originalKey
      this._statusString.push(originalKey)
      VIM.Statusline.update()
      return false
    }

    this._currentKeys.push({ key: originalKey, opts })
    this._statusString.push(originalKey)
    VIM.Statusline.update()

    let currentObject: CommandMap = COMMAND_MAP[VIM.Vim.mode]

    // Loop through all the keys
    for (const currentKey of this._currentKeys) {
      // If the currentObject[key] is a function, call it with the opts
      if (isFunction(currentObject[currentKey.key.toLowerCase()])) {
        const keyString = this._currentKeys.map((key) => key.key).join('')
        const repeat = parseInt(this._repeat, 10) || 1

        const func = (
          currentObject[currentKey.key.toLowerCase()] as unknown as (
            options: KeyboardOpts & { repeat?: number },
          ) => (...args: any[]) => void
        )({ ...opts, repeat })

        if (keyString !== 'dot') {
          VIM.VimBuffer.addToBuffer({
            buffer: SpecialRegisters.LAST_COMMAND_KEYS,
            value: { key: keyString, opts },
          })
        }

        // VIM.VimBuffer.addToBuffer({
        //   buffer: SpecialRegisters.LAST_COMMAND_KEYS,
        //   value: { key: nextCommand.params[0], opts: nextCommand.params[1] },
        // })

        // Clicked a key that requires keys after, ex f requires a target like fa to jump to a
        if (this._functionReturnsBreakCode(func) && this._needsAfterKeys.status === true) {
          this._afterKeys.push({ opts, key: originalKey })
          if (this._afterKeys.length === func.required) {
            ;(
              currentObject[currentKey.key.toLowerCase()] as unknown as (
                options: KeyboardOpts & { repeat?: number },
              ) => (...args: any[]) => void
            )({ ...this._originalOpts, afterKeys: this._afterKeys, repeat })
            this._resetState()
            return true
          }
          return false
        }

        // Has pressed a key which requires after keys and is now waiting for the next keys
        if (this._functionReturnsBreakCode(func) && this._needsAfterKeys.status === false) {
          this._originalOpts = opts
          this._needsAfterKeys = { status: true, requiredKeys: func.required }
          return false
        }
        // If the function is called but doesn't return a break code, reset the state
        if (!this._functionReturnsBreakCode(func)) this._resetState()
      }

      // If the currentObject[key] is undefined, then we need to reset the state
      if (typeof currentObject[currentKey.key.toLowerCase()] === 'undefined') {
        this._resetState()
        currentObject = COMMAND_MAP
        return false
      }
      currentObject = currentObject[currentKey.key] as CommandMap
    }

    return true
  }

  /**
   * Detects if a key should repeat.
   */
  private _shouldRepeat(key: string) {
    if (this._currentKeys.length === 0 && /[0-9]/.exec(key)) {
      return !(this._repeat === '' && key === '0')
    }
    return false
  }

  /**
   * Reset the state of the Motion class
   */
  private _resetState() {
    this._currentKeys = []
    this._afterKeys = []
    this._needsAfterKeys = { status: false, requiredKeys: 0 }
    this._repeat = ''
    this._statusString = []
    this._commandKeys = []
  }

  /**
   * Checks if a function returns a break code
   * Functions like `f` return a break code because they need characters after them
   */
  private _functionReturnsBreakCode(func: any): func is VimBreakCodesReturnType {
    if (typeof func === 'undefined') return false
    if (this.map[func.code] === true) return true

    // Checks if the functions' return type contains { code: string, required: number}
    const codeInFunc = (testFunction: any): testFunction is VimBreakCodesReturnType => {
      if (typeof testFunction === 'undefined' || testFunction === null) return false
      if (
        'code' in testFunction &&
        'required' in testFunction &&
        typeof testFunction.code === 'string' &&
        typeof testFunction.required === 'number'
      ) {
        this.map[testFunction.code] = true
        return true
      }
      return false
    }

    return codeInFunc(func) && Object.values(VimBreakCodes).includes(func.code)
  }
}

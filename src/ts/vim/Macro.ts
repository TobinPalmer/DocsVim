import { KeyboardOpts, LAST_COMMAND_KEYS, MacroStatus, PlaybackStatus } from '../types/vimTypes'
import { VIM } from '../main'

export default class Macro {
  public static PASTE_ESCAPE = 'IHopeNobodyTypesThisIfYouDoYouAreBadLol'
  private static _instance: Macro

  private constructor() {
    this._status = { playbackStatus: PlaybackStatus.STOPPED, register: '' }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  private _status: MacroStatus

  public get status() {
    return this._status
  }

  public set status(value: MacroStatus) {
    this._status = value
  }

  public static record(key: string, opts: KeyboardOpts, register: string) {
    VIM.VimBuffer.setMacroMap({ key, opts, register })
  }

  // public static runMacro({ keys, repeat = 1 }: { keys: LAST_COMMAND_KEYS[]; repeat?: number }) {
  //   const isFunction = (x: unknown): x is (options: KeyboardOpts) => void => typeof x === 'function'
  //
  //   const replayMacro = (number: number, idx = 0) => {
  //     const REPEAT_DELAY = 10
  //     const REPEAT_LIMIT = 150
  //
  //     if (number === 0 || number > REPEAT_LIMIT) {
  //       VIM.Macro.status.playbackStatus = PlaybackStatus.STOPPED
  //       return
  //     }
  //
  //     console.table(keys)
  //
  //     if (idx >= keys.length) {
  //       replayMacro(number - 1)
  //     } else {
  //       const { key, opts } = keys[idx]
  //       if (isFunction(key)) {
  //         key(opts)
  //       } else {
  //         VIM.Vim.keydown(key, opts)
  //       }
  //
  //       setTimeout(() => replayMacro(number, idx + 1), REPEAT_DELAY)
  //     }
  //   }
  //
  //   replayMacro(repeat + 1)
  // }

  // public static runMacro({ keys, repeat = 1 }: { keys: LAST_COMMAND_KEYS[]; repeat?: number }) {
  //   const isFunction = (x: unknown): x is (options: KeyboardOpts) => void => typeof x === 'function'
  //
  //   for (let i = 0; i < (repeat ?? 1); i++) {
  //     let count = 0
  //     setInterval(() => {
  //       if (count === keys.length) {
  //         VIM.Macro.status.playbackStatus = PlaybackStatus.STOPPED
  //         return
  //       }
  //       const { key, opts } = keys[count]
  //       if (isFunction(key)) {
  //         key(opts)
  //       } else {
  //         VIM.Vim.keydown(key, opts)
  //       }
  //       count++
  //     })
  //   }
  // }

  public static runMacro({ keys, repeat = 1 }: { keys: LAST_COMMAND_KEYS[]; repeat?: number }) {
    const isFunction = (x: unknown): x is (options: KeyboardOpts) => void => typeof x === 'function'

    const playbackInterval = 0
    const repeatDelay = 0

    let count = 0
    const intervalId = setInterval(() => {
      const { key, opts } = keys[count]
      if (isFunction(key)) {
        key(opts)
      } else {
        VIM.Vim.keydown(key, opts)
      }
      count++

      if (count === keys.length) {
        clearInterval(intervalId)
        VIM.Macro.status.playbackStatus = PlaybackStatus.STOPPED

        // Repeat the macro if necessary
        if (repeat > 1) {
          setTimeout(() => {
            Macro.runMacro({ keys, repeat: repeat - 1 })
          }, repeatDelay)
        }
      }
    }, playbackInterval)
  }

  public static clearMacro(register: string) {
    VIM.VimBuffer.getMacroMap().get(register)?.splice(0)
  }

  // eslint-disable-next-line complexity
  public static getMacroText(keys: LAST_COMMAND_KEYS[]) {
    let flag = false
    let insertPosition: number | null = null
    let temp = ''

    for (let i = 0; i < keys.length; i++) {
      if (!flag && ['i', 'I', 'a', 'A', 'o', 'O'].includes(keys[i].key as string)) {
        flag = true
        insertPosition = i
        continue
      }

      if (flag && keys[i].key === 'Escape') {
        if (insertPosition !== null) {
          keys.splice(insertPosition, 0, { key: Macro.PASTE_ESCAPE, opts: {} })
          keys[insertPosition + 1].key = this.cleanText(temp)

          keys.splice(insertPosition + 2, i - insertPosition)

          i = insertPosition + 1
        }
        temp = ''
        flag = false
        insertPosition = null
        continue
      }

      if (flag) {
        temp += keys[i].key
      }
    }

    if (flag && temp !== '' && insertPosition !== null) {
      keys.splice(insertPosition, 0, { key: Macro.PASTE_ESCAPE, opts: {} })
      keys[insertPosition + 1].key = this.cleanText(temp)
      keys.splice(insertPosition + 2)
    }

    return keys
  }

  private static cleanText(input: string): string {
    const keys = [
      { key: 'Enter', replaceWith: '\n' },
      { key: 'Space', replaceWith: ' ' },
      // other keys can be added here
    ]

    keys.forEach(({ key, replaceWith }) => {
      let index = input.indexOf(key)
      while (index !== -1) {
        input = input.slice(0, index) + replaceWith + input.slice(index + key.length)
        index = input.indexOf(key)
      }
    })

    // handle backspace separately due to deletion of previous character
    let backspace = input.indexOf('Backspace')
    while (backspace !== -1) {
      if (backspace === 0) {
        input = input.slice('Backspace'.length)
      } else {
        input = input.slice(0, backspace - 1) + input.slice(backspace + 'Backspace'.length)
      }
      backspace = input.indexOf('Backspace')
    }

    input = input.replace(
      /\\([nt]|Arrow(?:Up|Down|Left|Right)|Escape|Command|Control|Alt|Shift|Meta)/g,
      (_unused, match) => {
        switch (match) {
          case 'n':
            return '\n'
          case 't':
            return '\t'
          default:
            return ''
        }
      },
    )

    return input
  }
}

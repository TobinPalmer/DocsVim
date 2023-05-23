/* eslint-disable @typescript-eslint/no-explicit-any */
import { Keys } from '../input/FormatKey'
import { VIM } from '../main'
import { VimBreakCodes, type KeyboardOpts } from '../types/vimTypes'
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

  /**
   * Detects if a key should repeat.
   */
  private _shouldRepeat(key: string) {
    if (this._currentKeys.length === 0 && /[0-9]/.exec(key)) {
      if (this._repeat === '' && key === '0') return false
      return true
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
  }

  private readonly map: { [k: string]: any } = {}

  /**
   * Checks if a function returns a break code
   * Functions like `f` return a break code because they need characters after them
   */
  private _functionReturnsBreakCode(func: any): func is VimBreakCodesReturnType {
    if (typeof func === 'undefined') return false
    if (this.map[func.code] === true) return true

    // Checks if the functions return type contains { code: string, required: number}
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

    if (codeInFunc(func) && Object.values(VimBreakCodes).includes(func.code)) return true

    return false
  }

  /** Feed a key to the Motion class */
  // eslint-disable-next-line complexity
  public feedkey(originalKey: keyof Keys, opts: KeyboardOpts = {}): boolean {
    if (this._shouldRepeat(originalKey)) {
      this._repeat += originalKey
      return false
    }

    this._currentKeys.push({ key: originalKey, opts })

    let currentObject: CommandMap = COMMAND_MAP[VIM.Vim.mode]

    // Loop through all the keys
    for (const currentKey of this._currentKeys) {
      // If the currentObject[key] is a function, call it with the opts
      if (isFunction(currentObject[currentKey.key.toLowerCase()])) {
        const repeat = parseInt(this._repeat, 10) || 1

        const func = (
          currentObject[currentKey.key.toLowerCase()] as unknown as (
            options: KeyboardOpts & { repeat?: number },
          ) => (...args: any[]) => void
        )({ ...opts, repeat })

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

  // eslint-disable-next-line complexity
  // public feedkey(originalKey: keyof Keys, opts: KeyboardOpts = {}): boolean {
  //   if (this.shouldRepeat(originalKey)) {
  //     this.repeat += originalKey
  //     return false
  //   }
  //
  //   this.currentKeys.push({ key: originalKey, opts })
  //
  //   let currentObject: CommandMap = COMMAND_MAP[VIM.Vim.mode]
  //
  //   for (const currentKey of this.currentKeys) {
  //     const { key } = currentKey
  //     /**
  //      * If the key is a function, call it with the opts
  //      */
  //     if (isFunction(currentObject[key.toLowerCase()])) {
  //       const repeat = parseInt(this.repeat, 10) || 1
  //       // Return type of CommandMap[key]()
  //       /**
  //        * We are checking if it is equal to a valueof VimBreakCodes
  //        * If it is, then we need to see what the required keys that that method takes
  //        */
  //       interface VimBreakCodesReturnType {
  //         code: VimBreakCodes
  //         required: number
  //       }
  //
  //       const val = (
  //         currentObject[key.toLowerCase()] as unknown as (
  //           options: KeyboardOpts & { repeat?: number },
  //         ) => VimBreakCodesReturnType
  //       )({ ...opts, repeat })
  //       if (Object.values(VimBreakCodes).includes(val?.code)) {
  //         /**
  //          * The reson for required + 1, is because the first character is the orignal key, ex fg will be ['f', 'g']
  //          * Ex: Jumping to the letter g will be `fg`, The required key is 1, being g
  //          */
  //         if (this.afterKeys.length <= val.required) {
  //           // If the value is less than the required amount, push to the key array
  //           if (this.firstTimeCalled) {
  //             this.firstTimeCalled = false
  //           } else {
  //             this.afterKeys.push({ opts, key: originalKey })
  //             // eslint-disable-next-line max-depth
  //             if (this.afterKeys.length === val.required) {
  //               //   'running code with',
  //               //   currentObject[key.toLowerCase()] as unknown as (
  //               //     options: KeyboardOpts & { repeat?: number },
  //               //   ) => VimBreakCodesReturnType,
  //               //   {
  //               //     ...(({ afterKeys, ...spreadOpts }): KeyboardOpts => spreadOpts)(opts || {}),
  //               //     repeat,
  //               //     afterKeys: this.afterKeys,
  //               //   },
  //               // )
  //               ;(
  //                 currentObject[key.toLowerCase()] as unknown as (
  //                   options: KeyboardOpts & { repeat?: number },
  //                 ) => VimBreakCodesReturnType
  //               )({
  //                 // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //                 ...(({ afterKeys, ...spreadOpts }) => spreadOpts)(opts || {}),
  //                 repeat,
  //                 afterKeys: this.afterKeys,
  //               })
  //               this.firstTimeCalled = true
  //               this.afterKeys = []
  //             }
  //           }
  //         }
  //       } else {
  //         this.currentKeys = []
  //         this.repeat = ''
  //         currentObject = COMMAND_MAP
  //         return false
  //       }
  //     }
  //     if (typeof currentObject[key.toLowerCase()] === 'undefined') {
  //       this.currentKeys = []
  //       currentObject = COMMAND_MAP
  //       return false
  //     }
  //     currentObject = currentObject[key] as CommandMap
  //   }
  //
  //   return true
  // }
}

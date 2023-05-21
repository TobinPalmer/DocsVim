import { Keys } from '../input/FormatKey'
import { VIM } from '../main'
import { KeyboardOpts, VimBreakCodes } from '../types/vimTypes'
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFunction = (fun: unknown): fun is (...args: any[]) => void => typeof fun === 'function'
// Try g?w

export class Motion {
  /** Keys that have been pressed in a sequence until a motion is found */
  private readonly _afterKeys: { key: keyof Keys; opts: KeyboardOpts }[] = []
  private _currentKeys: { key: keyof Keys; opts: KeyboardOpts }[] = []
  private _repeat = ''
  private _needsAfterKeys: needsAfterKeys = { status: false, requiredKeys: 0 }

  private _shouldRepeat(key: string) {
    if (this._currentKeys.length === 0 && key.match(/[0-9]/)) {
      if (this._repeat === '' && key === '0') return true
      return true
    }
    return false
  }

  private _resetState() {
    this._currentKeys = []
    this._repeat = ''
  }

  private static _functionReturnsBreakCode(func: (...args: unknown[]) => void): func is () => VimBreakCodesReturnType {
    if (typeof func === 'undefined') return false
    function codeInFunc(testFunction: (...args: unknown[]) => void): testFunction is () => VimBreakCodesReturnType {
      if (
        'code' in testFunction &&
        'required' in testFunction &&
        typeof testFunction.code === 'string' &&
        typeof testFunction.required === 'number'
      ) {
        console.log('passed')
        return true
      }
      return false
    }

    if (codeInFunc(func)) {
      if (Object.values(VimBreakCodes).includes(func().code)) {
        return true
      }
    }
    return false
  }

  // eslint-disable-next-line complexity
  public feedkey(originalKey: keyof Keys, opts: KeyboardOpts = {}): boolean {
    if (this._shouldRepeat(originalKey)) {
      this._repeat += originalKey
      return false
    }

    if (this._needsAfterKeys.status === true) {
      console.log('needs keys')
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) => (...args: any[]) => void
        )({ ...opts, repeat })

        // Clicked a key that requires keys after, ex f requires a target like fa to jump to a
        if (Motion._functionReturnsBreakCode(func) && this._needsAfterKeys.status === true) {
          console.log('gg')
          this._afterKeys.push({ opts, key: originalKey })
        }

        console.log('cool', Motion._functionReturnsBreakCode(func))
        // Has pressed a key which requires after keys and is now waiting for the next keys
        if (Motion._functionReturnsBreakCode(func) && this._needsAfterKeys.status === false) {
          console.log('cool kid alert')
          // this.firstTimeCalled = false
          this._needsAfterKeys = { status: true, requiredKeys: func().required }
          return false
        }

        // If the function is called but doesn't return a break code, reset the state
        if (!Motion._functionReturnsBreakCode(func)) this._resetState()
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

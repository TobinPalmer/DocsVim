import { VIM } from '../main'
import { COMMAND_MAP } from './commandMap'
import { KeyboardOpts } from '../types/vimTypes'

interface CommandMap {
  [key: string]: CommandMap | (() => void)
}

const isFunction = (fun: unknown): fun is () => void => typeof fun === 'function'

export class Motion {
  private currentKeys: { key: string; opts: KeyboardOpts }[] = []

  public feedkey(key: string, opts: KeyboardOpts = {}): boolean {
    this.currentKeys.push({ key, opts })

    let currentObject: CommandMap = COMMAND_MAP[VIM.vim.mode]

    for (const currentKey of this.currentKeys) {
      const key = currentKey.key
      /**
       * If the key is a function, call it with the opts
       */
      if (isFunction(currentObject[key.toLowerCase()])) {
        ;(currentObject[key.toLowerCase()] as (opts: KeyboardOpts) => void)(opts)
        this.currentKeys = []
        currentObject = COMMAND_MAP
        return false
      } else {
        if (typeof currentObject[key.toLowerCase()] === 'undefined') {
          this.currentKeys = []
          currentObject = COMMAND_MAP
          return false
        }
        currentObject = currentObject[key] as CommandMap
      }
    }

    if (isFunction(currentObject)) {
      currentObject()
      this.currentKeys = []
      currentObject = COMMAND_MAP
    } else if (currentObject === undefined) {
      this.currentKeys = []
      currentObject = COMMAND_MAP
      return false
    } else {
      currentObject = currentObject as CommandMap
    }

    return true
  }
}

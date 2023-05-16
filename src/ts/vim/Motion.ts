import { VIM } from '../main'
import { KeyboardOpts } from '../types/vimTypes'
import { COMMAND_MAP } from './commandMap'

interface CommandMap {
  [key: string]: CommandMap | (() => void)
}

const isFunction = (fun: unknown): fun is () => void => typeof fun === 'function'

export class Motion {
  private currentKeys: { key: string; opts: KeyboardOpts }[] = []
  private repeat = ''

  private shouldRepeat(key: string) {
    if (this.currentKeys.length === 0 && key.match(/[0-9]/)) {
      if (this.repeat === '' && key === '0') return true
      return true
    }
    return false
  }

  public feedkey(key: string, opts: KeyboardOpts = {}): boolean {
    if (this.shouldRepeat(key)) {
      this.repeat += key
      return false
    }

    this.currentKeys.push({ key, opts })

    let currentObject: CommandMap = COMMAND_MAP[VIM.vim.mode]

    for (const currentKey of this.currentKeys) {
      // eslint-disable-next-line no-shadow
      const { key } = currentKey
      /**
       * If the key is a function, call it with the opts
       */
      if (isFunction(currentObject[key.toLowerCase()])) {
        const repeat = parseInt(this.repeat, 10) || 1
        ;(currentObject[key.toLowerCase()] as (options: KeyboardOpts & { repeat?: number }) => void)({
          ...opts,
          repeat,
        })

        this.currentKeys = []
        this.repeat = ''
        currentObject = COMMAND_MAP
        return false
      }
      if (typeof currentObject[key.toLowerCase()] === 'undefined') {
        this.currentKeys = []
        currentObject = COMMAND_MAP
        return false
      }
      currentObject = currentObject[key] as CommandMap
    }

    if (isFunction(currentObject)) {
      currentObject()
      this.currentKeys = []
      currentObject = COMMAND_MAP
    } else if (typeof currentObject === 'undefined') {
      this.currentKeys = []
      currentObject = COMMAND_MAP
      return false
    } else {
      currentObject = currentObject as CommandMap
    }

    return true
  }
}

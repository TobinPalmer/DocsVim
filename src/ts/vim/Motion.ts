import { COMMAND_MAP } from './commandMap'

interface CommandMap {
  [key: string]: CommandMap | (() => void)
}

const isFunction = (fun: unknown): fun is () => void => typeof fun === 'function'

export class Motion {
  private currentKeys: string[] = []

  public feedkey(key: string) {
    this.currentKeys.push(key)

    let currentObject: CommandMap = COMMAND_MAP

    for (const currentKey of this.currentKeys) {
      if (isFunction(currentObject[currentKey])) {
        ;(currentObject[currentKey] as () => void)()
        this.currentKeys = []
        currentObject = COMMAND_MAP
        return
      } else {
        if (typeof currentObject[currentKey] === 'undefined') {
          this.currentKeys = []
          currentObject = COMMAND_MAP
          return
        }
        currentObject = currentObject[currentKey] as CommandMap
      }
    }

    if (isFunction(currentObject)) {
      currentObject()
      this.currentKeys = []
      currentObject = COMMAND_MAP
    } else if (currentObject === undefined) {
      this.currentKeys = []
      currentObject = COMMAND_MAP
    } else {
      currentObject = currentObject as CommandMap
    }
  }
}

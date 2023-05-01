import { COMMAND_MAP } from './commandMap'

interface CommandMap {
  [key: string]: CommandMap | (() => void)
}

const isFunction = (fun: unknown): fun is () => void => typeof fun === 'function'

export class Motion {
  private currentKeys: string[] = []

  public feedkey(key: string) {
    console.log('original obj', COMMAND_MAP)
    this.currentKeys.push(key)
    console.log('feeding', key)

    let currentObject: CommandMap = COMMAND_MAP

    for (const currentKey of this.currentKeys) {
      console.log('currentKey:', currentKey, 'currentObject:', currentObject)
      if (isFunction(currentObject[currentKey])) {
        console.log('%cthis is a function', 'color: red; font-weight:bold;')
        console.log(currentObject[currentKey])
        ;(currentObject[currentKey] as () => void)()
        this.currentKeys = []
        currentObject = COMMAND_MAP
        return
      } else {
        console.log(currentObject, 'is not a func')
        if (typeof currentObject[currentKey] === 'undefined') {
          console.log('reseting', currentObject, currentKey)
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

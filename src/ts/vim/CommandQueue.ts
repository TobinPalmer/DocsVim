/* eslint-disable @typescript-eslint/no-explicit-any */
import docsInteractions from '../docs/docsInteraction'

interface CommandParams<T extends (...args: any[]) => any> {
  command: T
  params: Parameters<T>[0] extends undefined ? [] : Parameters<T>[0]
}

type Command = (...args: any[]) => any

export default class CommandQueue {
  private commandStack: [Command, any[], number][] = []
  private delayTimerId: ReturnType<typeof setTimeout> | null = null
  private currentDelay = 0

  public add<T extends Command>({ command, params, delay = 5 }: CommandParams<T> & { delay?: number }): void {
    this.commandStack.push([command, params, delay])

    if (this.delayTimerId === null) this.runCommands()
  }

  private runCommands(): void {
    if (this.delayTimerId !== null) {
      clearTimeout(this.delayTimerId)
      this.delayTimerId = null
    }

    let nextCommand = this.commandStack[0]
    const currentTime = new Date().getTime()

    while (nextCommand && (!nextCommand[2] || currentTime >= this.currentDelay + nextCommand[2])) {
      const [command, params, delay] = nextCommand
      this.currentDelay = delay ? currentTime : 0
      command(params)
      this.commandStack.shift()
      nextCommand = this.commandStack[0]
    }

    if (nextCommand && nextCommand[2]) {
      this.delayTimerId = setTimeout(() => {
        this.delayTimerId = null
        this.runCommands()
      }, nextCommand[2] - (currentTime - this.currentDelay))
    }
  }

  public get stack() {
    return this.commandStack
  }
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { warn } from 'console'
// import docsInteractions from '../docs/docsInteraction'
//
// interface CommandParams<T extends (...args: any[]) => any> {
//   command: T
//   params: Parameters<T>[0] extends undefined ? [] : Parameters<T>[0]
// }
//
// type Command = (...args: any[]) => any
//
// export default class CommandQueue {
//   private commandStack: [Command, any[], number][] = []
//   private delayTimerId: ReturnType<typeof setTimeout> | null = null
//   private currentDelay = 0
//
//   public add<T extends Command>({ command, params, delay = 500 }: CommandParams<T> & { delay?: number }): void {
//     this.commandStack.push([command, params, delay])
//
//     if (this.delayTimerId === null) this.runCommands()
//   }
//
//   private runCommands(): void {
//     if (this.delayTimerId !== null) {
//       clearTimeout(this.delayTimerId)
//       this.delayTimerId = null
//     }
//
//     const nextCommand = this.commandStack[0]
//     if (!nextCommand) return
//
//     const [command, params, delay] = nextCommand
//     const currentTime = new Date().getTime()
//
//     if (delay > 0 && (!this.currentDelay || currentTime >= this.currentDelay + delay)) {
//       this.currentDelay = currentTime
//       command(params)
//       this.commandStack.shift()
//       this.runCommands()
//     } else if (delay > 0) {
//       this.delayTimerId = setTimeout(() => {
//         this.delayTimerId = null
//         this.runCommands()
//       }, delay - (currentTime - this.currentDelay))
//     } else {
//       command(params)
//       this.commandStack.shift()
//       this.runCommands()
//     }
//   }
//
//   public get stack() {
//     return this.commandStack
//   }
// }

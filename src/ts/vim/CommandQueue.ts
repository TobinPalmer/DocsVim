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
  // private commandStack: [(...args: any[]) => void, Array<CommandParams<any>>, number][] = []
  private static readonly timeMap = {
    jumpTo: 150,
  }

  // public add<T extends (...args: any[]) => any>({
  //   command,
  //   params,
  //   delay = 0,
  // }: CommandParams<T> & { delay?: number }): void {
  //   this.commandStack.push([command, params, delay])
  //   this.runCommands()
  // }

  public add<T extends Command>({ command, params, delay = 0 }: CommandParams<T> & { delay?: number }): void {
    this.commandStack.push([command, params, delay])

    if (this.delayTimerId === null) {
      this.runCommands()
    }
  }

  private runCommands() {
    if (this.delayTimerId !== null) {
      clearTimeout(this.delayTimerId)
      this.delayTimerId = null
    }

    const nextCommand = this.commandStack.shift()

    if (nextCommand === undefined) {
      return
    }

    const [command, params, delay] = nextCommand

    if (delay > 0) {
      this.delayTimerId = setTimeout(() => {
        this.delayTimerId = null
        this.runCommands()
      }, delay)
      this.commandStack.unshift(nextCommand)
    } else {
      command(...params)
      this.runCommands()
    }
  }

  // private runCommands() {
  //   let timeLeft = 0
  //   for (const [command, params] of this.commandStack) {
  //     const delay = CommandBuilder.timeMap[command.name] ?? 0
  //     if (delay > 0) {
  //       setTimeout(() => {
  //         command(...params)
  //       }, timeLeft + delay)
  //       timeLeft += delay
  //     } else {
  //       command(...params)
  //     }
  //   }
  //   this.commandStack = [] // clear the stack after running all commands
  // }

  public get stack() {
    return this.commandStack
  }
}

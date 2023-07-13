/* eslint-disable @typescript-eslint/no-explicit-any */

import { VIM } from '../main'
import DocsInteractions from '../docs/DocsInteractions'
import { SpecialRegisters } from '../types/vimTypes'

/**
 * The interface for the parameters of a command
 * T will be the function, and it will infer the Parameters<T> type to get the parameters
 */
interface CommandParams<T extends (...args: any[]) => any> {
  func: T
  params: Parameters<T>[0] extends undefined ? [] : Parameters<T>[0]
}

/**
 * Type for command function
 */
type CommandFunction = (...args: any[]) => any

/**
 * The interface for each command object
 */
interface Command {
  func: CommandFunction
  params: any[] & { repeat?: number }
  delay: number
}

/**
 * The class that handles the queueing and execution of commands
 */
export default class CommandQueue {
  /**
   * The list of commands to be executed, commands are added, executed, and removed from the list in order
   */
  private readonly commandStack: Command[] = []

  /**
   * The timer that is used to delay the execution of commands
   */
  private delayTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Returns the current stack of commands
   */
  public get stack() {
    return this.commandStack
  }

  /**
   * Adds a command to a list of commands to be executed, in order
   * @param command The object of the command to add
   */
  public add<T extends CommandFunction>(command: CommandParams<T> & { delay?: number }): void {
    // default delay of 5ms
    command.delay ??= 5
    // add the command to the stack
    this.commandStack.push(command as Command)

    // If there is no current delay, run the commands
    if (this.delayTimer === null) this.runCommands()
  }

  /**
   * Runs the commands in the command stack, respecting delay
   */
  private runCommands(): void {
    // If there is a delay timer, clear it
    if (this.delayTimer !== null) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }

    // If there are no commands, return
    if (this.commandStack.length === 0) return

    // Get the next command
    const nextCommand = this.commandStack.shift()
    // If there is no next command, return
    if (typeof nextCommand === 'undefined') return

    if (nextCommand.func === DocsInteractions.pressKey) {
      DocsInteractions.correctCursorSize()
    }

    VIM.VimBuffer.addToBuffer({
      buffer: SpecialRegisters.LAST_COMMAND,
      value: { command: nextCommand.func.name, args: nextCommand.params },
    })

    // Run the command
    // Check if the commands params includes repeat and that the value is not bigger than VIM.VARIABLES.EXCESSIVE_REPEAT, if it is, set it to 0
    if (
      typeof nextCommand.params.repeat !== 'undefined' &&
      nextCommand.params.repeat > VIM.VARIABLES.EXCESSIVE_REPEAT
    ) {
      nextCommand.params.repeat = 1
    }

    nextCommand.func(nextCommand.params)

    // Set a new delay timer that will run the next command when finished
    this.delayTimer = setTimeout(() => {
      this.runCommands()
    }, nextCommand.delay)
  }
}

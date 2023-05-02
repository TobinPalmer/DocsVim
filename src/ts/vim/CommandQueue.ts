/* eslint-disable @typescript-eslint/no-explicit-any */
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
  params: any[]
  delay: number
}

/**
 * The class that handles the queueing and execution of commands
 */
export default class CommandQueue {
  /**
   * The list of commands to be executed, commands are added, executed, and removed from the list in order
   */
  private commandStack: Command[] = []

  /**
   * The timer that is used to delay the execution of commands
   */
  private delayTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Adds a command to a list of commands to be executed, in order
   * @param command The object of the command to add
   */
  public add<T extends CommandFunction>(command: CommandParams<T> & { delay?: number }): void {
    command.delay ||= 5 // default delay of 5ms

    this.commandStack.push(command as Command) // add the command to the stack

    if (this.delayTimer === null) this.runCommands() // If there is no current delay, run the commands
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

    const nextCommand = this.commandStack.shift() // Get the next command
    if (nextCommand == undefined) return // If there is no next command, return

    nextCommand.func(nextCommand.params) // Run the command

    // Set a new delay timer that will run the next command when finished
    this.delayTimer = setTimeout(() => {
      this.runCommands()
    }, nextCommand.delay)
  }

  /**
   * Returns the current stack of commands
   */
  public get stack() {
    return this.commandStack
  }
}

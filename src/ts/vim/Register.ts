import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { VimRegisters } from '../types/vimTypes'

/**
 * Register class handles the vim clipboard which is seperate from the system clipboard
 */
export default class Register {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Register
  private readonly registerContent: Map<VimRegisters, string>

  /**
   * Gets the users clipboard content
   */
  public async getClipboardContent({ fullLine }: { fullLine?: boolean } = {}) {
    try {
      const content = `${await navigator.clipboard.readText()}${fullLine ? '\n' : ''}`
      this.registerContent.set(VimRegisters.DEFAULT, content ?? '')
      return content
    } catch (error) {
      console.error('Failed to read clipboard content:', error)
      return null
    }
  }

  /**
   * Copies text that is seleted by the user
   */
  public async copyText({ fullLine }: { fullLine?: boolean } = {}) {
    console.log('copying text with ', fullLine)
    VIM.CommandQueue.add({ func: DocsInteractions.pressHTMLElement, params: { selector: '#docs-edit-menu' } })
    VIM.CommandQueue.add({ func: DocsInteractions.pressHTMLElement, params: { selector: '[id=":76"]' } })

    this.registerContent.set(VimRegisters.DEFAULT, (await this.getClipboardContent({ fullLine })) ?? '')
  }

  // public async getCurrentLine() {
  //   VIM.CommandQueue.add({
  //     func: DocsInteractions.pressKey,
  //     params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
  //   })
  //   VIM.CommandQueue.add({
  //     func: DocsInteractions.pressKey,
  //     params: { key: 'ArrowLeft', opts: { ctrlKey: true, shiftKey: true } },
  //   })
  //   this.registerContent.set(VimRegisters.LINE, (await this.getClipboardContent()) ?? '')
  // }

  private constructor() {
    this.registerContent = new Map<VimRegisters, string>()
    this.getClipboardContent()
      .then((content) => {
        if (content !== null) this.registerContent.set(VimRegisters.DEFAULT, content)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }

  // Gets an instance of the Register class
  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  // Gets the current register
  public get register() {
    return this.registerContent
  }
}

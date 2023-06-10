import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { type ClipboardContent, VimRegisters } from '../types/vimTypes'

/**
 * Register class handles the vim clipboard which is seperate from the system clipboard
 */
export default class Register {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Register
  private readonly registerContent: Map<keyof typeof VimRegisters, string>

  public async formatClipboardContent(content: ClipboardContent) {
    content = `${content}` as ClipboardContent
    await navigator.clipboard.writeText(content)
    this.registerContent.set(VimRegisters.DEFAULT, content)
  }

  /**
   * Gets the users clipboard content
   */
  public async getClipboardContent({ fullLine }: { fullLine?: boolean } = {}): Promise<ClipboardContent | null> {
    try {
      const content = await navigator.clipboard.readText()
      console.log(`%c CLIPBOARD CONTENT ${content}`, 'color: red')

      this.registerContent.set(VimRegisters.DEFAULT, content ?? '')
      return content as ClipboardContent
    } catch (error) {
      return null
    }
  }

  /**
   * Copies text that is seleted by the user
   */
  public async copyText({ fullLine }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '#docs-edit-menu' },
    })
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '[id=":76"]' },
    })

    this.registerContent.set(VimRegisters.DEFAULT, (await this.getClipboardContent({ fullLine })) ?? '')
  }

  private constructor() {
    this.registerContent = new Map<keyof typeof VimRegisters, string>()
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

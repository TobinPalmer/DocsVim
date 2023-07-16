import DocsInteractions from '../docs/DocsInteractions'
import { type ClipboardContent, CopyTypes, type RegisterContent, VimRegisters } from '../types/vimTypes'
import { VIM } from '../main'

/**
 * Register class handles the vim clipboard which is separate from the system clipboard
 */
export default class Register {
  private static _instance: Register
  private readonly registerContent: Map<keyof typeof VimRegisters, RegisterContent>

  private constructor() {
    this.registerContent = new Map<keyof typeof VimRegisters, RegisterContent>()
    this.getClipboardContent()
      .then((content) => {
        if (content !== null)
          this.registerContent.set(VimRegisters.DEFAULT, { content: content.content, type: CopyTypes.TEXT })
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

  public async formatClipboardContent(content: ClipboardContent): Promise<void> {
    content = content as ClipboardContent
    await navigator.clipboard.writeText(content)
    this.registerContent.set(VimRegisters.DEFAULT, { content, type: CopyTypes.TEXT })
  }

  /**
   * Gets the users clipboard content
   * Tries 10 times, every 250ms.
   * If the Document isn't focused, it will try again.
   */
  public async getClipboardContent({ fullLine = false }: { fullLine?: boolean } = {}) {
    const maxRetries = 10
    const delay = 250

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const newContent: RegisterContent = { content: '' as ClipboardContent, type: CopyTypes.TEXT }
        let content: ClipboardContent = '' as ClipboardContent

        // HACK: We need to wait for the clipboard to be ready
        const RESOLVE_TIME = 50
        await new Promise((resolve) => setTimeout(resolve, RESOLVE_TIME))

        content = ((await navigator.clipboard.readText()) ?? '') as ClipboardContent

        if (fullLine) {
          const selection = (`\n${content}` ?? '') as ClipboardContent
          content = selection

          newContent.content = selection
          newContent.type = CopyTypes.FULL_LINE

          this.registerContent.set(VimRegisters.DEFAULT, { content: selection, type: CopyTypes.FULL_LINE })
        } else {
          newContent.content = content

          this.registerContent.set(VimRegisters.DEFAULT, { content: content ?? '', type: CopyTypes.TEXT })
        }

        return newContent
      } catch (error) {
        console.error("Document isn't focused, trying again", error)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    // Retry attempts exhausted, return null
    return null
  }

  /**
   * Copies text that is selected by the user
   */
  public copyText({ fullLine = false }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '#docs-edit-menu' },
      delay: 0,
    })

    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '[id=":75"]', repeat: 2 },
      delay: 0,
    })

    setTimeout(async () => {
      this.registerContent.set(VimRegisters.DEFAULT, {
        content: (await this.getClipboardContent({ fullLine }))?.content ?? ('' as ClipboardContent),
        type: fullLine ? CopyTypes.FULL_LINE : CopyTypes.TEXT,
      })
    })

    return new Promise((resolve) => setTimeout(resolve, 0))
  }
}

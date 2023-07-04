import { VIM } from '../main'
import DocsInteractions from '../docs/DocsInteractions'
import { type RegisterContent, CopyTypes, VimRegisters, type ClipboardContent } from '../types/vimTypes'

/**
 * Register class handles the vim clipboard which is separate from the system clipboard
 */
export default class Register {
  // eslint-disable-next-line no-use-before-define
  private static _instance: Register
  private readonly registerContent: Map<keyof typeof VimRegisters, RegisterContent>

  public async formatClipboardContent(content: ClipboardContent): Promise<void> {
    content = content as ClipboardContent
    await navigator.clipboard.writeText(content)
    this.registerContent.set(VimRegisters.DEFAULT, { content, type: CopyTypes.TEXT })
  }

  /**
   * Gets the users clipboard content
   * Tries 10 times, every 250ms.
   * If Document isn't focused it will try again.
   */
  public async getClipboardContent({ fullLine = false }: { fullLine?: boolean } = {}) {
    console.log('Getting clipboard content', { fullLine })

    const maxRetries = 10
    const delay = 250

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const newContent: RegisterContent = { content: '' as ClipboardContent, type: CopyTypes.TEXT }
        // eslint-disable-next-line init-declarations
        let content: ClipboardContent

        // eslint-disable-next-line no-magic-numbers
        await new Promise((resolve) => setTimeout(resolve, 50))

        content = ((await navigator.clipboard.readText()) ?? '') as ClipboardContent
        console.log('THIS IS CONTENT', content)

        if (fullLine) {
          const selection = `\n${content}` as ClipboardContent
          content = selection ?? ''
          newContent.content = selection
          newContent.type = CopyTypes.FULL_LINE
          this.registerContent.set(VimRegisters.DEFAULT, { content: selection, type: CopyTypes.FULL_LINE })
          // console.log('getClipboardContent (FULL LINE)}', `->${selection}<-`)
        } else {
          newContent.content = content
          this.registerContent.set(VimRegisters.DEFAULT, { content: content ?? '', type: CopyTypes.TEXT })
          // console.log('getClipboardContent (NON FULL LINE)', `->${content}<-`)
        }

        console.log('RETURNING CONTENT', newContent)
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
    })
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '[id=":76"]' },
      delay: 0,
    })

    DocsInteractions.stopSelecting()
    setTimeout(async () => {
      this.registerContent.set(VimRegisters.DEFAULT, {
        content: (await this.getClipboardContent({ fullLine }))?.content ?? ('' as ClipboardContent),
        type: fullLine ? CopyTypes.FULL_LINE : CopyTypes.TEXT,
      })
      // eslint-disable-next-line no-magic-numbers
    }, 10)

    return new Promise((resolve) => setTimeout(resolve, 0))
  }

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
}

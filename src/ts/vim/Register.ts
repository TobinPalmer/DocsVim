import DocsInteractions from '../docs/DocsInteractions'
import { VIM } from '../main'
import { type ClipboardContent, VimRegisters } from '../types/vimTypes'

declare interface RegisterContent {
  type: 'FullLine' | 'Text'
  content: ClipboardContent | null
}

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
    this.registerContent.set(VimRegisters.DEFAULT, { content, type: 'Text' })
  }

  /**
   * Gets the users clipboard content
   * Tries 10 times, every 250ms.
   * If Document isn't focused it will try again.
   */
  public async getClipboardContent({ fullLine }: { fullLine?: boolean } = {}): Promise<ClipboardContent | null> {
    const maxRetries = 10
    const delay = 250

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        let content = ((await navigator.clipboard.readText()) ?? '') as ClipboardContent
        console.log('FIRST CHAR OF CONTENT', content[0], `->${content}<-`)
        if (fullLine) {
          const selection = `\nA${content}\n` as ClipboardContent
          content = selection ?? ''
          this.registerContent.set(VimRegisters.DEFAULT, { content: selection, type: 'Text' })
          console.log('getClipboardContent (FULL LINE)}', `->${selection}<-`)
        } else {
          this.registerContent.set(VimRegisters.DEFAULT, { content: content ?? '', type: 'Text' })
          console.log('getClipboardContent (NON FULL LINE)', `->${content}<-`)
        }
        console.log('RETURNING CONTENT', `->${content}<-`)
        return content as ClipboardContent
        // eslint-disable-next-line no-magic-numbers
      } catch (error) {
        console.error("Document isn't focused, trying again", error)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    return null
  }

  /**
   * Copies text that is selected by the user
   */
  public async copyText({ fullLine = false }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '#docs-edit-menu' },
    })
    VIM.CommandQueue.add({
      func: DocsInteractions.pressHTMLElement,
      params: { selector: '[id=":76"]' },
      delay: 0,
    })

    console.log('copyText ', await this.getClipboardContent({ fullLine }))
    await this.getClipboardContent({ fullLine }).then((text) => {
      console.log('copyText NEW', text)

      setTimeout(() => {
        console.log('copyText NEWEST', VIM.Register.register.get(VimRegisters.DEFAULT))
        // eslint-disable-next-line no-magic-numbers
      }, 2000)
    })
    this.registerContent.set(VimRegisters.DEFAULT, {
      content: (await this.getClipboardContent({ fullLine })) ?? ('' as ClipboardContent),
      type: 'Text',
    })
  }

  private constructor() {
    this.registerContent = new Map<keyof typeof VimRegisters, RegisterContent>()
    this.getClipboardContent()
      .then((content) => {
        if (content !== null) this.registerContent.set(VimRegisters.DEFAULT, { content, type: 'Text' })
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

import FormatKey, { Keys } from '../input/FormatKey'
import { VIM } from '../main'
import { type Color } from '../types/docTypes'
import { ClipboardContent, CopyTypes, type KeyboardOpts, VimMode, VimRegisters } from '../types/vimTypes'

/**
 * This class is used to interact with the Google Docs page
 */
export default class DocsInteractions {
  constructor() {
    DocsInteractions.textTarget()
      .then((target) => {
        target.addEventListener('keydown', (event) => {
          const opts: KeyboardOpts = {
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
          }
          if (event.key === 'Shift') return
          // Sends the keydown event to the vim class to handle it
          if (VIM.Vim.keydown(event.key, opts)) {
            event.preventDefault()
            event.stopPropagation()
            event.stopImmediatePropagation()
          }
        })
      })
      .catch((err) => {
        throw new Error(err)
      })
  }

  /**
   * Gets the users cursors element
   */
  static get getUserCursor(): Element | null {
    let cursor: Element | null = null

    document.querySelectorAll('.kix-cursor').forEach((element) => {
      const caretColor = element.querySelector('.kix-cursor-caret')
      if (caretColor === null) return

      const cursorName = (element.querySelector('.kix-cursor-name')?.textContent ?? '').trim()

      if (cursorName.length <= 0) cursor = element
    })
    if (cursor !== null) return cursor

    return document.querySelector('.kix-cursor')
  }

  /**
   * Gets the google docs text target
   */
  public static get textTarget(): () => Promise<HTMLElement> {
    return async () =>
      (
        (
          (await this._waitForElm({
            selector: '.docs-texteventtarget-iframe',
          })) as HTMLIFrameElement
        ).contentDocument as Document
      ).activeElement as HTMLElement
  }

  /**
   * Returns the font size of the Google doc
   */
  public static getFontSize(): number {
    return parseInt(
      (
        document.querySelector(
          '#fontSizeSelect .goog-toolbar-combo-button-outer-box.goog-inline-block .goog-toolbar-combo-button-input.jfk-textinput',
        ) as HTMLInputElement
      ).value,
      10,
    )
  }

  public static correctCursorSize() {
    const DELAY = 0
    setTimeout(() => {
      console.log('Correcting cursor size')
      const currentFontSize = this.getFontSize()
      this.setCursorWidth({ width: currentFontSize / 2 })
    }, DELAY)
  }

  /**
   * Stops selecting text
   */
  public static stopSelecting() {
    VIM.Vim.mode = VimMode.INSERT
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'ArrowRight' },
    })
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'ArrowLeft' },
    })
    VIM.Vim.mode = VimMode.NORMAL
  }

  /**
   * Pastes text into the Google Docs text target
   * @param text the selector to press
   */
  public static pasteText({ text }: { text: string }): typeof DocsInteractions {
    const element = (
      (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
        .contentDocument as Document
    ).querySelector('[contenteditable=true]') as HTMLElement

    const data = new DataTransfer()
    data.setData('text/plain', text)

    const paste = new ClipboardEvent('paste', { clipboardData: data })
    if (paste.clipboardData !== null) paste.clipboardData.setData('text/plain', text)

    element.dispatchEvent(paste)

    return this
  }

  public static async getTextFromRegister({ register: buffer }: { register: keyof typeof VimRegisters }) {
    const text = await VIM.Register.getClipboardContent()
    if (text === null) return

    VIM.Register.formatClipboardContent(text.content ?? ('' as ClipboardContent)).then(() => {
      const { content, type } = text
      VIM.Register.register.set(buffer, { content, type })
      return Promise.resolve(text)
    })
  }

  /**
   * Pastes the current text in a buffer
   */
  public static pasteFromRegister({ register: buffer }: { register: keyof typeof VimRegisters }) {
    const text = VIM.Register.register.get(buffer)

    if (text === null) return

    if (text?.type === CopyTypes.FULL_LINE) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'End' },
      })
    }
    VIM.CommandQueue.add({
      func: DocsInteractions.pasteText,
      params: { text: text?.content ?? '' },
    })
  }

  /**
   * Copies the text from the cursor to the start of the line
   */
  public static copyToStart({ fullLine }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'Home', opts: { shiftKey: true } },
    })

    VIM.Register.copyText({ fullLine: fullLine ?? false }).then(() => {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowRight' },
      })
    })

    VIM.Vim.mode = VimMode.NORMAL

    return Promise.resolve(VIM.Register.register.get(VimRegisters.DEFAULT))
  }

  /**
   * Copies the text from the cursor to the end of the line
   */
  public static copyToEnd({ fullLine }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'End', opts: { shiftKey: true } },
    })

    VIM.Register.copyText({ fullLine: fullLine ?? false }).then(() => {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowLeft', repeat: 2 },
      })
    })

    VIM.Vim.mode = VimMode.NORMAL

    return Promise.resolve(VIM.Register.register.get(VimRegisters.DEFAULT))
  }

  /**
   * Copies the current line
   */
  public static copyCurrentLine({ fullLine = false }: { fullLine?: boolean } = {}) {
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'Home' },
    })
    VIM.CommandQueue.add({
      func: DocsInteractions.pressKey,
      params: { key: 'End', opts: { shiftKey: true } },
    })

    VIM.Register.copyText({ fullLine }).then(() => {
      DocsInteractions.stopSelecting()
    })

    VIM.Vim.mode = VimMode.NORMAL
  }

  /**
   * @param width the width to set the cursor.
   * @param isInsertMode changes the color of the cursor depending on mode.
   */
  public static setCursorWidth({ width, isInsertMode }: { width: number; isInsertMode?: boolean }) {
    const cursor = this.getUserCursor

    if (cursor === null) return false
    const caret = cursor.querySelector('.kix-cursor-caret') as HTMLElement

    caret.style.borderWidth = `${width}px`
    const HALF_OPACITY = 0.5
    const cursorColor = `rgba(${isInsertMode ? 1 : HALF_OPACITY}, 0, 0, ${isInsertMode ? 1 : HALF_OPACITY})`
    // const cursorColor = `rgba(0, 0, 0, 0.5)`
    caret.style.setProperty('border-color', cursorColor, 'important')
    caret.style.mixBlendMode = 'difference'
    return true
  }

  /**
   * Clears the document of all text
   * @param mac if the user is on a Mac
   */
  public static clearDocument({ mac }: { mac?: boolean }): void {
    mac ??= VIM.isMac
    if (mac) {
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'ArrowUp', opts: { ctrlKey: true, mac: true } },
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: {
          key: 'ArrowDown',
          opts: { ctrlKey: true, mac: true, shiftKey: true },
        },
        delay: 0,
      })
      VIM.CommandQueue.add({
        func: DocsInteractions.pressKey,
        params: { key: 'Backspace' },
      })
    }
  }

  /**
   * Deletes Lines relative to the cursor
   * @param mac if the user is on a Mac
   * @param repeat how many lines to delete
   * @param direction the direction to delete in
   * @param endsOnEmptyLine if the cursor should end on an empty line
   */
  public static deleteLines({
    mac,
    repeat,
    direction,
    endsOnEmptyLine = true,
  }: {
    mac?: boolean
    repeat?: number
    direction: 'up' | 'down'
    endsOnEmptyLine?: boolean
  }): void {
    mac ??= VIM.isMac
    if (mac) {
      if (direction === 'up') {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowRight', opts: { ctrlKey: true } },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowUp', opts: { shiftKey: true }, repeat },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Backspace', opts: { ctrlKey: true } },
          delay: 0,
        })
        if (!endsOnEmptyLine) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace' },
            delay: 0,
          })
        }
      } else {
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowDown', repeat },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowRight', opts: { ctrlKey: true } },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', opts: { shiftKey: true, ctrlKey: true } },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowUp', opts: { shiftKey: true }, repeat },
          delay: 0,
        })
        VIM.CommandQueue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'Backspace', opts: { ctrlKey: true } },
          delay: 0,
        })
        if (endsOnEmptyLine) {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Enter' },
            delay: 0,
          })
        } else {
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'Backspace', opts: { ctrlKey: true } },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowDown' },
            delay: 0,
          })
          VIM.CommandQueue.add({
            func: DocsInteractions.pressKey,
            params: { key: 'ArrowLeft', opts: { ctrlKey: true } },
            delay: 0,
          })
        }
      }
    }
  }

  /**
   * Presses a key (not types a letter)
   * @param key the key to press
   * @param opts the options for the key
   * @param repeat how many times to repeat the key
   */
  public static pressKey({
    key,
    opts = {},
    repeat = 1,
  }: {
    key: keyof Keys
    opts?: KeyboardOpts
    repeat?: number
  }): typeof DocsInteractions {
    opts.mac = opts.mac ?? VIM.isMac
    const element = (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
      .contentDocument as Document
    if (!element) return this

    const keyMapper = {
      ArrowUp: 38,
      ArrowDown: 40,
      ArrowLeft: 37,
      ArrowRight: 39,
      Backspace: 8,
      Enter: 13,
      Home: 36,
      End: 35,
      Escape: 27,
    } as const

    const event = new KeyboardEvent('keydown', {
      keyCode: keyMapper[key as keyof typeof keyMapper],
      key: FormatKey.format(key, opts.mac),
      ctrlKey: opts.ctrlKey && !opts.mac,
      shiftKey: opts.shiftKey,
      altKey: opts.altKey,
      metaKey: VIM.isMac && opts.ctrlKey,
    })

    for (let i = 0; i < repeat; i++) element.dispatchEvent(event)
    return this
  }

  /**
   * Jumps to a letter, either forward or backward
   * @param target The letter to jump to
   * @param forward Whether to go forward or backward
   * @param repeat How many times to repeat
   */
  public static jumpTo({
    target,
    forward = true,
    repeat = 1,
  }: {
    target: keyof Keys
    forward?: boolean
    repeat?: number
  }): void {
    if (forward)
      VIM.CommandQueue.add({
        func: DocsInteractions.copyToEnd,
        params: { fullLine: true },
      })
    else
      VIM.CommandQueue.add({
        func: DocsInteractions.copyToStart,
        params: { fullLine: true },
      })

    VIM.CommandQueue.add({
      func: DocsInteractions.getTextFromRegister,
      params: { register: VimRegisters.DEFAULT },
    })

    function analyseText(text: string) {
      console.log('analysing', text)
      const ERROR_INDEX = -1
      const arr = text.split('')
      let index = ERROR_INDEX
      let count = 1
      if (!forward) arr.reverse()
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
          if (count === repeat) index = i
          count++
        }
      }

      if (index === ERROR_INDEX) return { index: null, length: null }
      return { index: index + 1, length: arr.length }
    }

    const CLIPBOARD_COPY_DELAY = 100

    setTimeout(() => {
      const regContent = VIM.Register.register.get(VimRegisters.DEFAULT)?.content ?? ''
      const analyse = analyseText(regContent)
      if (analyse.index === null) return
      const queue = VIM.CommandQueue
      if (forward) {
        queue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowRight', repeat: analyse.index },
        })
      } else {
        queue.add({
          func: DocsInteractions.pressKey,
          params: { key: 'ArrowLeft', repeat: analyse.index },
        })
      }
      console.log('INDEX TO LETTER', analyseText(regContent).index)
    }, CLIPBOARD_COPY_DELAY)
  }

  /**
   * Picks a highlight color
   * @param color the color to pick
   */
  public static pickColor({ color }: { color: Color }): void {
    DocsInteractions._openColorMenu()

    DocsInteractions.pressHTMLElement({
      selector: `.docs-material-colorpalette-colorswatch[title="${color}"]`,
      clickingMenuItem: true,
    })
  }

  /**
   * Undoes the last action
   */
  public static undo(): void {
    DocsInteractions._openEditMenu()
    DocsInteractions.pressHTMLElement({ selector: '[id=":71"]', repeat: 1 })
  }

  /**
   * Copies the selected text to your system clipboard
   */
  public static copy(): void {
    DocsInteractions._openEditMenu()
    DocsInteractions.pressHTMLElement({ selector: '[id=":76"]', repeat: 2 })
  }

  /**
   * Gets the google docs text target
   */
  public static pickHighlight({ color }: { color: Color | 'none' }): void {
    DocsInteractions._openHighlightMenu()
    if (color === 'none') {
      DocsInteractions.pressHTMLElement({
        selector: '.goog-menuitem.colormenuitems-no-color',
        clickingMenuItem: true,
      })
      return
    }
    DocsInteractions.pressHTMLElement({
      selector: `.goog-menu.goog-menu-vertical.docs-colormenuitems.docs-material.goog-menu-noaccel [id=":b1"] + .docs-material-colorpalette .docs-material-colorpalette-colorswatch[title="${color}"]`,
      clickingMenuItem: true,
    })
  }

  /**
   * Toggles Bold
   */
  public static toggleBold() {
    DocsInteractions.pressKey({
      key: 'b',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
  }

  /**
   * Toggles Italic
   */
  public static toggleItalic() {
    DocsInteractions.pressKey({
      key: 'i',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
  }

  /**
   * Toggles Underline
   */
  public static toggleUnderline() {
    DocsInteractions.pressKey({
      key: 'u',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
  }

  /**
   * Presses on an HTML element.
   * @param selector the selector to press
   * @param clickingMenuItem whether or not the element is a menu item
   * @param repeat the number of times to repeat the action
   */
  public static pressHTMLElement({
    selector,
    clickingMenuItem = false,
    repeat = 1,
  }: {
    selector: string
    clickingMenuItem?: boolean
    repeat?: number
  }) {
    const element = document.querySelector(selector)
    if (!element) return
    console.log('Pressing', element)

    const opts = { bubbles: true }

    if (!clickingMenuItem) {
      const mousedown = new MouseEvent('mousedown', opts)
      for (let i = 0; i < repeat; i++) element.dispatchEvent(mousedown)
    }

    const events = {
      mouseenter: new MouseEvent('mouseenter', opts),
      mousedown: new MouseEvent('mousedown', opts),
      mouseup: new MouseEvent('mouseup', opts),
      click: new MouseEvent('click', opts),
      mouseleave: new MouseEvent('mouseleave', opts),
    }

    for (let i = 0; i < repeat; i++) {
      element.dispatchEvent(events.mouseenter)
      element.dispatchEvent(events.mousedown)
      element.dispatchEvent(events.mouseup)
      element.dispatchEvent(events.click)
      element.dispatchEvent(events.mouseleave)
    }
  }

  /**
   * Opens the color menu
   */
  private static _openColorMenu(): void {
    DocsInteractions.pressHTMLElement({ selector: '#textColorButton' })
  }

  /**
   * Opens the highlights menu
   */
  private static _openHighlightMenu(): void {
    DocsInteractions.pressHTMLElement({ selector: '#bgColorButton' })
  }

  /**
   * Opens the undo menu
   */
  private static _openEditMenu(): void {
    DocsInteractions.pressHTMLElement({ selector: '#docs-edit-menu' })
  }

  /**
   * Waits for element to exist, then runs callback
   */
  private static _waitForElm({ selector }: { selector: string }): Promise<HTMLElement> {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) return resolve(document.querySelector(selector) as HTMLElement)

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector) as HTMLElement)
          observer.disconnect()
        }
      })

      return observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }
}

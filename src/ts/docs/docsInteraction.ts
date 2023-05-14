import FormatKey, { type Keys } from '../input/FormatKey'

import { VIM } from '../main'
import { type Color } from '../types/docTypes'
import { type KeyboardOpts } from '../types/vimTypes'

/**
 * This class is used to interact with the google docs page
 */
export default class docsInteractions {
  constructor() {
    docsInteractions.textTarget().then((target) => {
      target.addEventListener('keydown', (e) => {
        const opts: KeyboardOpts = {
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          altKey: e.altKey,
        }
        // Sends the keydown event to the vim class to handle it
        if (VIM.vim.keydown(e.key, opts)) {
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
        }
      })
    })
  }

  public static getFontSize(): number {
    return parseInt(
      (document.querySelector('[id=":16"] .goog-toolbar-combo-button-input.jfk-textinput') as HTMLInputElement).value,
    )
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
    const cursorColor = `rgba(0, 0, 0, ${isInsertMode ? 1 : 0.5})`
    // const cursorColor = `rgba(0, 0, 0, 0.5)`
    caret.style.setProperty('border-color', cursorColor, 'important')
    caret.style.mixBlendMode = 'difference'
    return true
  }

  /**
   * Gets the users cursors elemenet
   * @returns {Element | null}
   */
  static get getUserCursor(): Element | null {
    let cursor: Element | null = null

    document.querySelectorAll('.kix-cursor').forEach((el) => {
      const caretColor = el.querySelector('.kix-cursor-caret')
      if (caretColor === null) return

      const cursorName = (el.querySelector('.kix-cursor-name')?.textContent ?? '').trim()

      if (cursorName.length <= 0) cursor = el
    })
    if (cursor !== null) return cursor

    return document.querySelector('.kix-cursor')
  }

  /**
   * Presses a key (not types a letter)
   */
  public static pressKey({
    key,
    opts = {},
    repeat = 1,
  }: {
    key: keyof Keys
    opts?: KeyboardOpts
    repeat?: number
  }): typeof docsInteractions {
    opts.mac = opts.mac ?? VIM.isMac
    const element = (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
      .contentDocument as Document
    if (!element) return this

    const keyMapper = Object.freeze({
      ArrowUp: 38,
      ArrowDown: 40,
      ArrowLeft: 37,
      ArrowRight: 39,
      Backspace: 8,
      Enter: 13,
    })

    const event = new KeyboardEvent('keydown', {
      keyCode: keyMapper[key as keyof typeof keyMapper] || null,
      key: FormatKey.format(key, opts.mac),
      ctrlKey: opts.ctrlKey && !opts.mac,
      shiftKey: opts.shiftKey,
      altKey: opts.altKey,
      metaKey: VIM.isMac && (opts.ctrlKey || false),
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
    // Return exesively long repeats
    if (repeat > 1000 || target.length > 1) return
    docsInteractions.pressHTMLElement({
      selector: '.goog-menuitem.apps-menuitem[id=":7d"]',
      clickingMenuItem: false,
      repeat: 2,
    })
    ;(document.querySelector('.docs-findinput-container input') as HTMLInputElement).value = target
    if (
      (document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).getAttribute('aria-checked') ===
      'false'
    ) {
      console.log('clicking match case')
      ;(document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).click()
    }

    ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
      'none'
    if (forward) {
      for (let i = 1; i < repeat; ++i) {
        console.log('clicking next')
        docsInteractions.pressHTMLElement({
          selector: '#docs-findandreplacedialog-button-next',
        })
      }
    } else {
      for (let i = 1; i < repeat + 1; i++) {
        console.log('clicking previous')
        docsInteractions.pressHTMLElement({
          selector: '#docs-findandreplacedialog-button-previous',
        })
      }
    }
    docsInteractions.pressHTMLElement({
      selector: '.modal-dialog-title-close',
    })
    setTimeout(() => {
      docsInteractions.pressKey({ key: 'ArrowLeft' })
      ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
        'block'
    }, 175)
    return
  }

  private static _openColorMenu(): void {
    docsInteractions.pressHTMLElement({ selector: '#textColorButton' })
  }

  private static _openHighlightMenu(): void {
    docsInteractions.pressHTMLElement({ selector: '#bgColorButton' })
  }

  public static pickColor({ color }: { color: Color }): void {
    docsInteractions._openColorMenu()

    docsInteractions.pressHTMLElement({
      selector: `.docs-material-colorpalette-colorswatch[title="${color}"]`,
      clickingMenuItem: true,
    })
  }

  private static _openUndoMenu(): void {
    docsInteractions.pressHTMLElement({ selector: '#docs-edit-menu' })
  }

  public static undo(): void {
    docsInteractions._openUndoMenu()
    docsInteractions.pressHTMLElement({ selector: '[id=":72"]', repeat: 2 })
  }

  private static _waitForElm({ selector }: { selector: string }): Promise<HTMLElement> {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) return resolve(document.querySelector(selector) as HTMLElement)

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector) as HTMLElement)
          observer.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  }

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

  public static pickHighlight({ color }: { color: Color | 'none' }): void {
    docsInteractions._openHighlightMenu()
    if (color === 'none') {
      docsInteractions.pressHTMLElement({
        selector: '.goog-menuitem.colormenuitems-no-color',
        clickingMenuItem: true,
      })
      return
    }
    docsInteractions.pressHTMLElement({
      selector: `.goog-menu.goog-menu-vertical.docs-colormenuitems.docs-material.goog-menu-noaccel [id=":b1"] + .docs-material-colorpalette .docs-material-colorpalette-colorswatch[title="${color}"]`,
      clickingMenuItem: true,
    })
  }

  public static toggleBold() {
    docsInteractions.pressKey({
      key: 'b',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
    // VIM.CommandQueue.add({
    //   command: docsInteractions.pressKey,
    //   params: { key: 'b', opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac } },
    // })
  }

  public static toggleItalic() {
    docsInteractions.pressKey({
      key: 'i',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
  }

  public static toggleUnderline() {
    docsInteractions.pressKey({
      key: 'u',
      opts: { ctrlKey: true, shiftKey: false, mac: VIM.isMac },
    })
  }

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

  public static pasteText({ text }: { text: string }): typeof docsInteractions {
    const el = (
      (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
        .contentDocument as Document
    ).querySelector('[contenteditable=true]') as HTMLElement

    const data = new DataTransfer()
    data.setData('text/plain', text)

    const paste = new ClipboardEvent('paste', { clipboardData: data })
    if (paste.clipboardData !== null) paste.clipboardData.setData('text/plain', text)

    el.dispatchEvent(paste)

    return this
  }
}

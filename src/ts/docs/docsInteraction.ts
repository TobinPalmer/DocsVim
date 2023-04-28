import FormatKey, { type Keys } from '../input/FormatKey'
import { GLOBALS } from '../main'
import { type Color } from '../types/docTypes'
import { type keyboardOpts } from '../types/vimTypes'

export default class docsInteractions {
  public static startTime = Date.now()
  constructor() {
    docsInteractions.textTarget().then((target) => {
      target.addEventListener('keydown', (e) => {
        GLOBALS.vim.keydown(e.key)
      })
    })
  }

  public static setCursorWidth(width: string, isInsertMode?: boolean) {
    const cursor = this.getUserCursor

    if (cursor === null) return false
    const caret = cursor.querySelector('.kix-cursor-caret') as HTMLElement

    caret.style.borderWidth = width
    const cursorColor = `rgba(${isInsertMode ? 0 : 255}, 0, 0, ${isInsertMode ? 1 : 0.5})`
    caret.style.setProperty('border-color', cursorColor, 'important')
    caret.style.mixBlendMode = 'difference'
    return true
  }

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

  private static readonly keyMapper = {
    ArrowUp: 38,
    ArrowDown: 40,
    ArrowLeft: 37,
    ArrowRight: 39,
    Enter: 13,
  } as const

  public static pressKey(
    key: keyof Keys,
    opts: keyboardOpts = { mac: GLOBALS.isMac },
    repeat = 1,
  ): typeof docsInteractions {
    const element = (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
      .contentDocument as Document
    if (!element) return this

    const event = new KeyboardEvent('keydown', {
      keyCode: docsInteractions.keyMapper[key as keyof typeof docsInteractions.keyMapper] || null,
      key: FormatKey.format(key, opts.mac),
      ctrlKey: opts.ctrlKey && !opts.mac,
      shiftKey: opts.shiftKey,
      metaKey: GLOBALS.isMac && (opts.ctrlKey || false),
    })

    console.log('SENDING:', event)

    for (let i = 0; i < repeat; i++) element.dispatchEvent(event)
    return this
  }

  public static jumpTo(target: keyof Keys, amount = 1, forward = true): void {
    if (amount > 1000 || target.length > 1) return
    this.pressHTMLElement('.goog-menuitem.apps-menuitem[id=":7d"]')
    this.pressHTMLElement('.goog-menuitem.apps-menuitem[id=":7d"]')
    ;(document.querySelector('.docs-findinput-container input') as HTMLInputElement).value = target

    if (
      (document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).getAttribute('aria-checked') ===
      'false'
    ) {
      ;(document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).click()
    }

    // ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
    //   'none'
    if (amount === 1 && forward) this.pressHTMLElement('#docs-findandreplacedialog-button-previous')
    this.pressHTMLElement('.modal-dialog-title-close')
    setTimeout(() => {
      this.pressKey('ArrowLeft')
      ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
        'block'
    }, 300)
  }

  private static _openColorMenu(): void {
    this.pressHTMLElement('#textColorButton')
  }

  private static _openHighlightMenu(): void {
    this.pressHTMLElement('#bgColorButton')
  }

  public static pickColor(color: Color): void {
    this._openColorMenu()
    this.pressHTMLElement(`.docs-material-colorpalette-colorswatch[title="${color}"]`, true)
  }

  private static _waitForElm(selector: string): Promise<HTMLElement> {
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
      (((await this._waitForElm('.docs-texteventtarget-iframe')) as HTMLIFrameElement).contentDocument as Document)
        .activeElement as HTMLElement
  }

  public static pickHighlight(color: Color | 'none'): void {
    this._openHighlightMenu()
    if (color === 'none') {
      this.pressHTMLElement('.goog-menuitem.colormenuitems-no-color', true)
      return
    }
    this.pressHTMLElement(
      `.goog-menu.goog-menu-vertical.docs-colormenuitems.docs-material.goog-menu-noaccel [id=":b1"] + .docs-material-colorpalette .docs-material-colorpalette-colorswatch[title="${color}"]`,
      true,
    )
  }

  public static toggleBold(): typeof docsInteractions {
    this.pressKey('b', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static toggleItalic(): typeof docsInteractions {
    this.pressKey('i', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static toggleUnderline(): typeof docsInteractions {
    this.pressKey('u', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static pressHTMLElement = (selector: string, clickingMenuItem = false, amount = 1) => {
    const element = document.querySelector(selector)
    if (!element) return

    const opts = { bubbles: true }

    if (!clickingMenuItem) {
      const mousedown = new MouseEvent('mousedown', opts)
      for (let i = 0; i < amount; i++) element.dispatchEvent(mousedown)
    }

    const events = {
      mouseenter: new MouseEvent('mouseenter', opts),
      mousedown: new MouseEvent('mousedown', opts),
      mouseup: new MouseEvent('mouseup', opts),
      click: new MouseEvent('click', opts),
      mouseleave: new MouseEvent('mouseleave', opts),
    }

    for (let i = 0; i < amount; i++) {
      element.dispatchEvent(events.mouseenter)
      element.dispatchEvent(events.mousedown)
      element.dispatchEvent(events.mouseup)
      element.dispatchEvent(events.click)
      element.dispatchEvent(events.mouseleave)
    }
  }

  public static pasteText(text: string): void {
    this._pasteText(text)
  }

  private static _pasteText(text: string): typeof docsInteractions {
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

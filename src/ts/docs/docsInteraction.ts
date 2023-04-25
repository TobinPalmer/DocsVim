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

  public static pressKey(key: Keys, opts: keyboardOpts = {}, repeat = 1): typeof docsInteractions {
    const element = (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
      .contentDocument as Document
    const event = new KeyboardEvent('keydown', {
      keyCode: FormatKey.format(key, opts.mac),
      ctrlKey: (opts.ctrlKey && !opts.mac) ?? false,
      shiftKey: opts.shiftKey ?? false,
      metaKey: GLOBALS.isMac ? opts.ctrlKey ?? false : false,
    })
    console.log(event, 'event')
    for (let i = 0; i < repeat; i++) element.dispatchEvent(event)
    return this
  }

  public static jumpTo(target: string): void {
    if (target.length > 1) return
    console.log(Math.floor((Date.now() - this.startTime) / 1000), 'n')
    if (Math.floor((Date.now() - this.startTime) / 1000) < 3) {
      console.warn('Calling jumpTo too early, please wait at least 3 seconds')
      return
    }
    this.pressHTMLElement('#docs-edit-menu', true)
    this.pressHTMLElement('.goog-menuitem.apps-menuitem[id=":7d"]')
    this.pressHTMLElement('.goog-menuitem.apps-menuitem[id=":7d"]')
    ;(document.querySelector('.docs-findinput-container input') as HTMLInputElement).value = target
    // Toggles checkbox on and off to focus box
    ;(document.querySelector('#docs-findandreplacedialog-use-regular-expressions') as HTMLElement).click()
    ;(document.querySelector('#docs-findandreplacedialog-use-regular-expressions') as HTMLElement).click()

    this.pressHTMLElement('#docs-findandreplacedialog-button-next')
    this.pressKey('esc', {})
    this.pressKey('ArrowUp')
    // this.pressHTMLElement('.modal-dialog-title-close')
    // setTimeout(() => {
    //   this.pressKey('ArrowLeft')
    // }, 100    )
  }

  private static _openColorMenu() {
    this.pressHTMLElement('#textColorButton')
  }

  private static _openHighlightMenu() {
    this.pressHTMLElement('#bgColorButton')
  }

  public static pickColor(color: Color) {
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

  public static pickHighlight(color: Color | 'none') {
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

  public static toggleBold() {
    this.pressKey('b', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static toggleItalic() {
    this.pressKey('i', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static toggleUnderline() {
    this.pressKey('u', { ctrlKey: true, shiftKey: false, mac: GLOBALS.isMac })

    return this
  }

  public static pressHTMLElement = (selector: string, clickingMenuItem = false, addNewLine = false) => {
    const element = document.querySelector(selector)
    if (!element) return

    console.log('pressing', element)

    const opts = { bubbles: true }

    if (!clickingMenuItem) element.dispatchEvent(new MouseEvent('mousedown', opts))

    element.dispatchEvent(new MouseEvent('mouseenter', opts))
    element.dispatchEvent(new MouseEvent('mousedown', opts))
    element.dispatchEvent(new MouseEvent('mouseup', opts))
    element.dispatchEvent(new MouseEvent('click', opts))
    element.dispatchEvent(new MouseEvent('mouseleave', opts))

    /**
     * Unused
     */
    if (addNewLine) {
      try {
        navigator.clipboard.readText().then((clipboardText) => {
          console.log(`"${clipboardText.trim()}"`)
          navigator.clipboard.writeText(`${clipboardText.trim()}\n`)
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  public static pasteText(text: string) {
    this._pasteText(text)
  }

  private static _pasteText(text: string) {
    const el = (
      (document.getElementsByClassName('docs-texteventtarget-iframe')[0] as HTMLIFrameElement)
        .contentDocument as Document
    ).querySelector('[contenteditable=true]') as HTMLElement

    const data = new DataTransfer()
    data.setData('text/plain', text)

    const paste = new ClipboardEvent('paste', {
      clipboardData: data,
    })
    if (paste.clipboardData !== null) paste.clipboardData.setData('text/plain', text)

    el.dispatchEvent(paste)

    return this
  }
}

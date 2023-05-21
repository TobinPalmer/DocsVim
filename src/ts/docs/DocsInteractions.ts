import FormatKey, { Keys } from '../input/FormatKey'
import { VIM } from '../main'
import { type Color } from '../types/docTypes'
import { type KeyboardOpts } from '../types/vimTypes'

/**
 * This class is used to interact with the google docs page
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
   * Returns the font size of the google doc
   */
  public static getFontSize(): number {
    return parseInt(
      (document.querySelector('[id=":16"] .goog-toolbar-combo-button-input.jfk-textinput') as HTMLInputElement).value,
      10,
    )
  }

  /**
   * @param width the width to set the cursor.
   * @param isInsertMode changes the color of the cursor depending on mode.
   */
  public static setCursorWidth({ width, isInsertMode }: { width: number; isInsertMode?: boolean }) {
    console.log("Changing the cursor's style")
    const cursor = this.getUserCursor

    if (cursor === null) return false
    const caret = cursor.querySelector('.kix-cursor-caret') as HTMLElement

    caret.style.borderWidth = `${width}px`
    const HALF_OPACITY = 0.5
    const cursorColor = `rgba(0, 0, 0, ${isInsertMode ? 1 : HALF_OPACITY})`
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
   * Clears the document of all text
   * @param mac if the user is on a mac
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
        params: { key: 'ArrowDown', opts: { ctrlKey: true, mac: true, shiftKey: true } },
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
   * @param mac if the user is on a mac
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
    } as const

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
    console.log(`Jumping to ${target}`)
    // Return exesively long repeats
    if (repeat > VIM.VARIABLES.EXCESSIVE_REPEAT || target.length > 1) return
    DocsInteractions.pressHTMLElement({
      selector: '.goog-menuitem.apps-menuitem[id=":7d"]',
      clickingMenuItem: false,
      repeat: 2,
    })
    ;(document.querySelector('.docs-findinput-container input') as HTMLInputElement).value = target
    if (
      (document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).getAttribute('aria-checked') ===
      'false'
    ) {
      ;(document.querySelector('#docs-findandreplacedialog-match-case') as HTMLElement).click()
    }

    // ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.setProperty(
    //   'opacity',
    //   '0',
    //   'important',
    // )
    // ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
    //   'none'
    if (forward) {
      for (let i = 1; i < repeat; ++i) {
        DocsInteractions.pressHTMLElement({
          selector: '#docs-findandreplacedialog-button-next',
        })
      }
    } else {
      for (let i = 1; i < repeat + 1; i++) {
        DocsInteractions.pressHTMLElement({
          selector: '#docs-findandreplacedialog-button-previous',
        })
      }
    }
    const ARROW_DELAY_TIME = 200
    const PRESS_X_TIME = 250
    const ARROW_DELAY = PRESS_X_TIME + ARROW_DELAY_TIME

    setTimeout(() => {
      console.log('pressing', document.querySelector('.modal-dialog-title-close') as HTMLElement)
      ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.display =
        'none'
      DocsInteractions.pressHTMLElement({
        selector: '.modal-dialog-title-close',
      })
    }, PRESS_X_TIME)
    setTimeout(() => {
      DocsInteractions.pressKey({ key: 'ArrowLeft' })
      ;(document.querySelector('.modal-dialog.docs-dialog.docs-findandreplacedialog') as HTMLElement).style.opacity =
        '1'
    }, ARROW_DELAY)
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
  private static _openUndoMenu(): void {
    DocsInteractions.pressHTMLElement({ selector: '#docs-edit-menu' })
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
    DocsInteractions._openUndoMenu()
    DocsInteractions.pressHTMLElement({ selector: '[id=":72"]', repeat: 2 })
  }

  /**
   * Copies the selected text to your system clipboard
   */
  public static copy(): void {
    DocsInteractions._openUndoMenu()
    DocsInteractions.pressHTMLElement({ selector: '[id=":76"]', repeat: 2 })
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
   * Pastes text into the google docs text target
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
}